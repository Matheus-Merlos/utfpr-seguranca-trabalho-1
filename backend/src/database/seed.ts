import { DataSource } from 'typeorm';
import { createHash } from 'crypto';
import { Usuario, Role } from '../entities/usuario.entity';
import { Disciplina } from '../entities/disciplina.entity';
import { Matricula } from '../entities/matricula.entity';
import { Nota } from '../entities/nota.entity';
import { Recado } from '../entities/recado.entity';

function hashSenha(senha: string): string {
  return createHash('md5').update(senha).digest('hex');
}

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'sigacad',
    password: process.env.DB_PASSWORD || 'sigacad',
    database: process.env.DB_NAME || 'sigacad',
    entities: [Usuario, Disciplina, Matricula, Nota, Recado],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Conectado ao banco de dados');

  const usuarioRepo = dataSource.getRepository(Usuario);
  const disciplinaRepo = dataSource.getRepository(Disciplina);
  const matriculaRepo = dataSource.getRepository(Matricula);
  const notaRepo = dataSource.getRepository(Nota);
  const recadoRepo = dataSource.getRepository(Recado);

  const existingAdmin = await usuarioRepo.findOne({ where: { username: 'admin' } });
  if (existingAdmin) {
    console.log('Seed já foi executado anteriormente');
    await dataSource.destroy();
    return;
  }

  console.log('Criando usuários...');

  const admin = usuarioRepo.create({
    username: 'admin',
    email: 'admin@sigacad.edu.br',
    senha: hashSenha('admin'),
    nomeExibicao: 'Administrador',
    role: Role.ADMIN,
  });
  await usuarioRepo.save(admin);

  const professores: Usuario[] = [];
  const dadosProfessores = [
    { username: 'maria.silva', email: 'maria.silva@sigacad.edu.br', nome: 'Prof. Maria Silva' },
    { username: 'joao.santos', email: 'joao.santos@sigacad.edu.br', nome: 'Prof. João Santos' },
    { username: 'ana.oliveira', email: 'ana.oliveira@sigacad.edu.br', nome: 'Prof. Ana Oliveira' },
  ];

  for (const p of dadosProfessores) {
    const prof = usuarioRepo.create({
      username: p.username,
      email: p.email,
      senha: hashSenha('prof123'),
      nomeExibicao: p.nome,
      role: Role.PROFESSOR,
    });
    await usuarioRepo.save(prof);
    professores.push(prof);
  }

  const alunos: Usuario[] = [];
  const nomesAlunos = [
    'Lucas Ferreira', 'Mariana Costa', 'Pedro Almeida', 'Julia Rodrigues',
    'Gabriel Martins', 'Beatriz Lima', 'Rafael Souza', 'Larissa Pereira',
    'Matheus Gomes', 'Amanda Ribeiro', 'Felipe Carvalho', 'Camila Fernandes',
    'Gustavo Barbosa', 'Leticia Dias', 'Bruno Cardoso', 'Isabela Nunes',
    'Rodrigo Moreira', 'Fernanda Alves', 'Thiago Rocha', 'Carolina Mendes',
  ];

  for (let i = 0; i < nomesAlunos.length; i++) {
    const nome = nomesAlunos[i];
    const username = nome.toLowerCase().replace(' ', '.').normalize('NFD').replace(/[̀-ͯ]/g, '');
    const aluno = usuarioRepo.create({
      username,
      email: `${username}@aluno.sigacad.edu.br`,
      senha: hashSenha('aluno123'),
      nomeExibicao: nome,
      role: Role.ALUNO,
    });
    await usuarioRepo.save(aluno);
    alunos.push(aluno);
  }

  console.log('Criando disciplinas...');

  const dadosDisciplinas = [
    { codigo: 'CS101', nome: 'Introdução à Programação', profIndex: 0 },
    { codigo: 'CS102', nome: 'Estruturas de Dados', profIndex: 0 },
    { codigo: 'CS201', nome: 'Banco de Dados', profIndex: 1 },
    { codigo: 'CS202', nome: 'Engenharia de Software', profIndex: 1 },
    { codigo: 'CS301', nome: 'Redes de Computadores', profIndex: 2 },
    { codigo: 'CS302', nome: 'Sistemas Operacionais', profIndex: 2 },
    { codigo: 'MA101', nome: 'Cálculo I', profIndex: 0 },
    { codigo: 'MA102', nome: 'Álgebra Linear', profIndex: 1 },
  ];

  const disciplinas: Disciplina[] = [];
  for (const d of dadosDisciplinas) {
    const disciplina = disciplinaRepo.create({
      codigo: d.codigo,
      nome: d.nome,
      professorId: professores[d.profIndex].id,
    });
    await disciplinaRepo.save(disciplina);
    disciplinas.push(disciplina);
  }

  console.log('Criando matrículas e notas...');

  const matriculas: Matricula[] = [];
  for (const aluno of alunos) {
    const numDisciplinas = 3 + Math.floor(Math.random() * 3);
    const disciplinasAluno = [...disciplinas].sort(() => Math.random() - 0.5).slice(0, numDisciplinas);

    for (const disciplina of disciplinasAluno) {
      const matricula = matriculaRepo.create({
        alunoId: aluno.id,
        disciplinaId: disciplina.id,
      });
      await matriculaRepo.save(matricula);
      matriculas.push(matricula);

      const tipos = ['P1', 'P2', 'Trabalho'];
      for (const tipo of tipos) {
        const nota = notaRepo.create({
          matriculaId: matricula.id,
          tipo,
          valor: Math.round((Math.random() * 5 + 5) * 10) / 10,
        });
        await notaRepo.save(nota);
      }
    }
  }

  console.log('Criando recados no mural...');

  const recadosGerais = [
    { autor: admin, conteudo: 'Bem-vindos ao novo semestre letivo!' },
    { autor: professores[0], conteudo: 'Lembrete: entrega do trabalho final até sexta-feira.' },
    { autor: professores[1], conteudo: 'Aula de reposição na quinta-feira às 19h.' },
    { autor: alunos[0], conteudo: 'Alguém tem as anotações da última aula de Cálculo?' },
    { autor: alunos[5], conteudo: 'Grupo de estudos para a prova de BD, quem topa?' },
  ];

  for (const r of recadosGerais) {
    const recado = recadoRepo.create({
      conteudo: r.conteudo,
      autorId: r.autor.id,
      disciplinaId: null,
    });
    await recadoRepo.save(recado);
  }

  for (const disciplina of disciplinas.slice(0, 3)) {
    const recado = recadoRepo.create({
      conteudo: `Material complementar disponível no sistema.`,
      autorId: disciplina.professorId,
      disciplinaId: disciplina.id,
    });
    await recadoRepo.save(recado);
  }

  console.log('Seed concluído com sucesso!');
  console.log(`- ${1} admin`);
  console.log(`- ${professores.length} professores`);
  console.log(`- ${alunos.length} alunos`);
  console.log(`- ${disciplinas.length} disciplinas`);
  console.log(`- ${matriculas.length} matrículas`);

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro ao executar seed:', err);
  process.exit(1);
});
