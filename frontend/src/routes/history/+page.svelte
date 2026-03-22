<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores';
  import type { User } from '$lib/stores';
  import SidebarNav from '$lib/components/SidebarNav.svelte';
  import ProfileDropdown from '$lib/components/ProfileDropdown.svelte';
  import { onMount } from 'svelte';

  let user = $state<User | null>(null);

  onMount(() => {
    const unsubscribe = currentUser.subscribe(value => {
      user = value;
      if (!value) {
        goto('/');
      }
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<div class="page-container">
  <header class="header">
    <div class="header-left">
      <SidebarNav />
    </div>
    <div class="header-right">
      <span class="user-name">{user?.name}</span>
      <ProfileDropdown />
    </div>
  </header>

  <main class="main-content">
    <div class="history-container">
      <h1 class="page-title">History</h1>
      <p class="page-subtitle">Your appointment history will appear here</p>

      <div class="empty-state">
        <p class="empty-message">No appointments yet</p>
      </div>
    </div>
  </main>
</div>

<style>
  .page-container {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-name {
    font-size: 0.875rem;
    color: var(--color-muted);
  }

  .main-content {
    flex: 1;
    padding: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  .history-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-white);
    margin-bottom: 0.25rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
    color: var(--color-muted);
    margin-bottom: 1.5rem;
  }

  .empty-state {
    padding: 3rem 2rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .empty-message {
    font-size: 1rem;
    color: var(--color-muted);
    margin: 0;
  }

  @media (max-width: 480px) {
    .main-content {
      padding: 1rem;
    }

    .page-title {
      font-size: 1.25rem;
    }

    .user-name {
      display: none;
    }
  }

  @media (max-width: 360px) {
    .header {
      padding: 0.75rem 1rem;
    }

    .main-content {
      padding: 0.75rem;
    }

    .page-title {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .page-subtitle {
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }

    .empty-state {
      padding: 2rem 1rem;
      border-radius: 10px;
    }

    .empty-message {
      font-size: 0.9rem;
    }
  }
</style>
