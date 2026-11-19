export async function buscarDisciplinas(termo?: string) {
  const params = termo ? `?busca=${encodeURIComponent(termo)}` : '';
  const res = await fetch(`/api/disciplinas${params}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar disciplinas');
  return res.json();
}

export async function getDisciplina(id: string) {
  const res = await fetch(`/api/disciplinas/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Disciplina não encontrada');
  return res.json();
}
