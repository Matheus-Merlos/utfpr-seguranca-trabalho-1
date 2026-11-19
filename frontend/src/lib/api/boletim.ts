export async function getBoletim(alunoId: string) {
  const res = await fetch(`/api/alunos/${alunoId}/boletim`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao buscar boletim');
  return res.json();
}
