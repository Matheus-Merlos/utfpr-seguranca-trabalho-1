export async function getUsuarios(): Promise<any[]> {
  const res = await fetch('/api/usuarios', {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao carregar usuários');
  return res.json();
}

export async function atualizarUsuario(id: string, dados: { nomeExibicao?: string; email?: string; role?: string }): Promise<any> {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao atualizar usuário');
  return res.json();
}

export async function deletarUsuario(id: string): Promise<void> {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erro ao deletar usuário');
}
