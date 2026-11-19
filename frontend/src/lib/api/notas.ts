export async function getDisciplinasProfessor(): Promise<any[]> {
  const res = await fetch('/api/disciplinas', {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao carregar disciplinas');
  return res.json();
}

export async function getAlunosDisciplina(disciplinaId: string): Promise<any[]> {
  const res = await fetch(`/api/disciplinas/${disciplinaId}/alunos`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao carregar alunos');
  return res.json();
}

export async function atualizarNota(id: string, dados: { nota1?: number; nota2?: number }): Promise<any> {
  const res = await fetch(`/api/notas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao atualizar nota');
  return res.json();
}
