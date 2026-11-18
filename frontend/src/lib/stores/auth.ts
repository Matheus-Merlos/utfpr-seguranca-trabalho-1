import { writable } from 'svelte/store';

interface User {
  id: string;
  username: string;
  email: string;
  nomeExibicao: string;
  role: string;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<{ user: User | null; loading: boolean }>({
    user: null,
    loading: true,
  });

  return {
    subscribe,
    setUser: (user: User | null) => update(state => ({ ...state, user, loading: false })),
    setLoading: (loading: boolean) => update(state => ({ ...state, loading })),
    logout: () => set({ user: null, loading: false }),
  };
}

export const auth = createAuthStore();

export async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      const user = await res.json();
      auth.setUser(user);
    } else {
      auth.setUser(null);
    }
  } catch {
    auth.setUser(null);
  }
}

export async function login(username: string, senha: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, senha }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  auth.setUser(data.user);
  return data;
}

export async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  auth.logout();
}
