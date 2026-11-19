<script lang="ts">
  import type { Snippet } from 'svelte';
  import Sidebar from './sidebar.svelte';
  import Topbar from './topbar.svelte';
  import MobileMenu from './mobile-menu.svelte';

  interface Props {
    user: { nomeExibicao: string; role: string } | null;
    currentPath: string;
    onLogout: () => void;
    children: Snippet;
  }

  let { user, currentPath, onLogout, children }: Props = $props();

  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<div class="flex h-screen bg-background">
  <!-- Desktop Sidebar -->
  <div class="hidden lg:flex">
    <Sidebar role={user?.role || 'ALUNO'} {currentPath} />
  </div>

  <!-- Mobile Menu -->
  <MobileMenu
    open={mobileMenuOpen}
    role={user?.role || 'ALUNO'}
    {currentPath}
    onClose={closeMobileMenu}
  />

  <!-- Main Content -->
  <div class="flex flex-1 flex-col overflow-hidden">
    <Topbar {user} {onLogout} onMenuClick={toggleMobileMenu} />

    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
    </main>
  </div>
</div>
