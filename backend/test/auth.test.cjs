const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const { createHash, randomBytes, randomUUID } = require('node:crypto');
const { EventEmitter, once } = require('node:events');
const { Client } = require('pg');
const { SMTPServer } = require('smtp-server');
const { NestFactory } = require('@nestjs/core');
const { DataSource } = require('typeorm');
const cookieParser = require('cookie-parser');
const { Usuario } = require('../dist/entities/usuario.entity');
const { hashSenha } = require('../dist/auth/senha');
const { segredoJwt } = require('../dist/auth/sessao');
const { AllExceptionsFilter } = require('../dist/common/filters/all-exceptions.filter');

const host = '127.0.0.1';
const database = 'ach04_' + randomUUID().replaceAll('-', '');
const admin = new Client({ host, database: 'postgres' }); // PGPORT, PGUSER e PGPASSWORD
const caixa = new EventEmitter();
let app, smtp, base, usuarios, criouBanco;

before(async () => {
  await admin.connect();
  await admin.query('CREATE DATABASE ' + database);
  criouBanco = true;
  smtp = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    onData(stream, session, done) {
      let mensagem = '';
      stream.setEncoding('utf8');
      stream.on('data', parte => { mensagem += parte; });
      stream.once('end', () => {
        caixa.emit(session.envelope.rcptTo[0].address, mensagem);
        done();
      });
    },
  });
  await new Promise(resolve => smtp.listen(0, host, resolve));
  Object.assign(process.env, {
    NODE_ENV: 'test', JWT_SECRET: randomBytes(32).toString('hex'),
    DB_HOST: host, DB_PORT: String(admin.port), DB_USER: admin.user,
    DB_PASSWORD: admin.password, DB_NAME: database,
    SMTP_HOST: host, SMTP_PORT: String(smtp.server.address().port),
    SMTP_FROM: 'sigacad@example.test', SMTP_USER: '', SMTP_PASSWORD: '',
  });
  app = await iniciarApi();
  base = await app.getUrl();
  usuarios = app.get(DataSource).getRepository(Usuario);
});

async function iniciarApi() {
  const { AppModule } = require('../dist/app.module');
  const apiLocal = await NestFactory.create(AppModule, { logger: false, abortOnError: false });
  apiLocal.use(cookieParser());
  apiLocal.setGlobalPrefix('api');
  apiLocal.useGlobalFilters(new AllExceptionsFilter());
  await apiLocal.listen(0, host);
  return apiLocal;
}

after(async () => {
  if (app) await app.close();
  if (smtp) await new Promise(resolve => smtp.close(resolve));
  if (criouBanco) await admin.query('DROP DATABASE ' + database);
  await admin.end();
});

async function conta(legado = false) {
  const username = randomUUID();
  const senha = randomBytes(16).toString('hex');
  const email = username + '@example.test';
  const registro = await usuarios.save({
    username, email, nomeExibicao: 'Conta de teste', role: 'ALUNO',
    senha: legado ? createHash('md5').update(senha).digest('hex') : await hashSenha(senha),
  });
  return { username, email, senha, id: registro.id };
}

function api(metodo, rota, body, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers.Cookie = cookie;
  return fetch(base + '/api/' + rota, { method: metodo, headers, body: JSON.stringify(body) });
}

function login({ username, senha }) {
  return api('POST', 'auth/login', { username, senha });
}

async function sessao(usuario) {
  const res = await login(usuario);
  assert.equal(res.status, 201);
  return res.headers.get('set-cookie').split(';')[0];
}

function me(cookie) { return api('GET', 'auth/me', undefined, cookie); }
function recuperar(email) { return api('POST', 'auth/recuperar-senha', { email }); }
function redefinir(token, novaSenha) { return api('POST', 'auth/resetar-senha', { token, novaSenha }); }

async function pedirCodigo(email) {
  const chegada = once(caixa, email, { signal: AbortSignal.timeout(10000) });
  const [res, [mensagem]] = await Promise.all([recuperar(email), chegada]);
  assert.equal(res.status, 201);
  const separador = mensagem.indexOf('\r\n\r\n');
  const cabecalho = mensagem.slice(0, separador);
  const corpo = mensagem.slice(separador + 4);
  const texto = /Content-Transfer-Encoding: base64/i.test(cabecalho)
    ? Buffer.from(corpo, 'base64').toString('utf8')
    : corpo.replace(/=\r?\n/g, ''); // quebras de transporte do quoted-printable
  const token = texto.match(/^([a-f0-9]{64})\r?$/m)?.[1];
  assert.ok(token, 'o e-mail deve incluir o código de recuperação');
  assert.deepEqual(await res.json(), { message: 'Se o email existir, enviaremos instruções' });
  return token;
}

test('configuração exige um segredo e o cookie HTTPS inclui as proteções da sessão', async t => {
  const usuario = await conta();
  const anterior = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    assert.throws(segredoJwt);
    process.env.JWT_SECRET = 'curto';
    assert.throws(segredoJwt);
  } finally { process.env.JWT_SECRET = anterior; }
  process.env.NODE_ENV = 'production';
  t.after(() => { process.env.NODE_ENV = 'test'; });
  const res = await login(usuario);
  assert.equal(res.status, 201);
  const flags = res.headers.get('set-cookie').split('; ').slice(1);
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Max-Age=900', 'Path=/']) {
    assert.ok(flags.includes(flag), flag);
  }
  assert.deepEqual(Object.keys((await res.json()).user).sort(), ['email', 'id', 'nomeExibicao', 'role', 'username']);
  const cookie = res.headers.get('set-cookie').split(';')[0];
  assert.equal((await me(cookie)).status, 200);
  const agora = Date.now();
  t.mock.method(Date, 'now', () => agora + 901000);
  assert.equal((await me(cookie)).status, 401);
});

test('logout revoga a sessão no servidor e um novo login funciona', async () => {
  const usuario = await conta();
  const cookie = await sessao(usuario);
  const res = await api('POST', 'auth/logout', {}, cookie);
  assert.equal(res.status, 201);
  assert.ok(res.headers.get('set-cookie').startsWith('token=;'));
  assert.equal((await me(cookie)).status, 401);
  assert.equal((await me(await sessao(usuario))).status, 200);
});

test('migra MD5 após login válido e usa a mesma resposta para falhas de credencial', async () => {
  const usuario = await conta(true);
  const errada = await login({ ...usuario, senha: 'incorreta' });
  const ausente = await login({ username: randomUUID(), senha: 'incorreta' });
  assert.equal(errada.status, 401);
  assert.equal(ausente.status, 401);
  assert.equal((await errada.json()).message, (await ausente.json()).message);
  await sessao(usuario);
  const salvo = await usuarios.findOne({ where: { id: usuario.id }, select: ['senha'] });
  assert.ok(salvo.senha.startsWith('scrypt$'));
  assert.ok(salvo.senha !== await hashSenha(usuario.senha), 'cada hash usa sal próprio');
});

test('SMTP local entrega códigos distintos, só o mais recente vale e o banco guarda o hash', async () => {
  const usuario = await conta();
  const anterior = await pedirCodigo(usuario.email);
  const atual = await pedirCodigo(usuario.email);
  assert.ok(atual !== anterior);
  const registro = await usuarios.findOne({ where: { id: usuario.id }, select: ['resetTokenHash'] });
  assert.ok(registro.resetTokenHash === createHash('sha256').update(atual).digest('hex'));
  const desconhecido = await recuperar('desconhecido@example.test');
  assert.equal(desconhecido.status, 201);
  assert.deepEqual(await desconhecido.json(), { message: 'Se o email existir, enviaremos instruções' });
  const candidata = randomBytes(16).toString('hex');
  assert.equal((await redefinir(anterior, candidata)).status, 400);
  assert.equal((await redefinir(randomBytes(32).toString('hex'), candidata)).status, 400);
  await usuarios.update(usuario.id, { resetTokenExpiraEm: new Date(Date.now() - 1000) });
  assert.equal((await redefinir(atual, candidata)).status, 400);
  await sessao(usuario);
  assert.equal((await login({ ...usuario, senha: candidata })).status, 401);
});

test('duas redefinições simultâneas consomem o código uma vez e invalidam a sessão anterior', async () => {
  const usuario = await conta();
  const cookie = await sessao(usuario);
  const token = await pedirCodigo(usuario.email);
  const novaSenha = randomBytes(16).toString('hex');
  const respostas = await Promise.all([redefinir(token, novaSenha), redefinir(token, novaSenha)]);
  assert.deepEqual(respostas.map(r => r.status).sort(), [201, 400]);
  assert.equal((await me(cookie)).status, 401);
  assert.equal((await login(usuario)).status, 401);
  await sessao({ ...usuario, senha: novaSenha });
});

test('editar o e-mail cancela o código pendente e preserva a versão da sessão', async () => {
  const usuario = await conta();
  const cookie = await sessao(usuario);
  const token = await pedirCodigo(usuario.email);
  assert.equal((await api('PATCH', 'usuarios/me', { email: 'novo@example.test' }, cookie)).status, 200);
  assert.equal((await redefinir(token, usuario.senha)).status, 400);
  assert.equal((await me(cookie)).status, 200);
});

test('a rotação da chave recusa uma sessão emitida antes da reinicialização', async () => {
  const usuario = await conta();
  const cookie = await sessao(usuario);
  assert.equal((await me(cookie)).status, 200);
  await app.close();
  app = undefined;
  process.env.JWT_SECRET = randomBytes(32).toString('hex');
  app = await iniciarApi();
  base = await app.getUrl();
  usuarios = app.get(DataSource).getRepository(Usuario);
  assert.equal((await me(cookie)).status, 401);
  assert.equal((await me(await sessao(usuario))).status, 200);
});
