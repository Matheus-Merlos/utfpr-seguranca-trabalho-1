export async function getRecados() {
  const res = await fetch('/api/mural', {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar recados');
  return res.json();
}

export async function criarRecado(conteudo: string, disciplinaId?: string) {
  const res = await fetch('/api/mural', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ conteudo, disciplinaId }),
  });
  if (!res.ok) throw new Error('Erro ao criar recado');
  return res.json();
}
