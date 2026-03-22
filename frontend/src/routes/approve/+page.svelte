<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser, requests } from '$lib/stores';
  import type { Request } from '$lib/stores';
  import SidebarNav from '$lib/components/SidebarNav.svelte';
  import ProfileDropdown from '$lib/components/ProfileDropdown.svelte';
  import RequestRow from '$lib/components/RequestRow.svelte';
  import { onMount } from 'svelte';

  let user = $state<{ name: string; role: string } | null>(null);
  let allRequests = $state<Request[]>([]);

  onMount(() => {
    const unsubscribe = currentUser.subscribe(value => {
      if (!value) {
        goto('/');
      } else if (value.role !== 'academic_advisor' && value.role !== 'faculty_advisor') {
        goto('/book');
      } else {
        user = value;
      }
    });

    const unsubRequests = requests.subscribe(value => {
      allRequests = value;
    });

    return () => {
      unsubscribe();
      unsubRequests();
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
    <div class="requests-section">
      <div class="requests-header">
        <h2 class="section-title">Incoming Requests</h2>
        <span class="request-count">{allRequests.filter(r => r.status === 'pending').length} pending</span>
      </div>

      {#if allRequests.length === 0}
        <div class="empty-state">
          <p class="empty-title">No requests yet</p>
          <p class="empty-message">Your appointment requests will appear here</p>
        </div>
      {:else}
        <div class="requests-list">
          {#each allRequests as request (request.id)}
            <RequestRow {request} />
          {/each}
        </div>
      {/if}
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
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
  }

  .requests-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    overflow-y: auto;
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-white);
    margin-bottom: 1rem;
  }

  .requests-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .request-count {
    font-size: 0.8rem;
    color: var(--color-accent);
    background: rgba(49, 45, 94, 0.2);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-weight: 500;
  }

  .requests-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .empty-state {
    padding: 3rem 2rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .empty-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-white);
    margin-bottom: 0.5rem;
  }

  .empty-message {
    font-size: 0.875rem;
    color: var(--color-muted);
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 1rem;
    }

    .requests-header {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .user-name {
      display: none;
    }

    .main-content {
      padding: 0.75rem;
    }

    .section-title {
      font-size: 1rem;
    }
  }

  @media (max-width: 360px) {
    .header {
      padding: 0.75rem 1rem;
      gap: 0.5rem;
    }

    .main-content {
      padding: 0.5rem;
    }

    .requests-section {
      max-width: 100%;
    }

    .section-title {
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }

    .requests-header {
      margin-bottom: 0.75rem;
      gap: 0.5rem;
    }

    .request-count {
      font-size: 0.75rem;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
    }

    .requests-list {
      gap: 0.6rem;
    }

    .empty-state {
      padding: 2rem 1rem;
    }

    .empty-title {
      font-size: 0.95rem;
      margin-bottom: 0.4rem;
    }

    .empty-message {
      font-size: 0.8rem;
    }
  }
</style>
