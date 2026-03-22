<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores';
  import { List, X } from 'phosphor-svelte';
  import { slide } from 'svelte/transition';

  let showSidebar = $state(false);
  let user = $state<{ name: string; role: string } | null>(null);

  $effect(() => {
    const unsubscribe = currentUser.subscribe(value => {
      user = value;
    });
    return unsubscribe;
  });

  function closeSidebar() {
    showSidebar = false;
  }

  function handleNavigation(route: string) {
    goto(route);
    closeSidebar();
  }

  function handleBackdropClick() {
    closeSidebar();
  }
</script>

<div class="nav-container">
  <button class="menu-btn" onclick={() => (showSidebar = !showSidebar)} aria-label="Menu">
    <List size={24} weight="bold" />
  </button>

  {#if showSidebar}
    <!-- Backdrop -->
    <div
      class="sidebar-backdrop"
      onclick={handleBackdropClick}
      onkeydown={(e) => e.key === 'Escape' && closeSidebar()}
      role="presentation"
    ></div>

    <!-- Sidebar -->
    <nav class="sidebar" transition:slide={{ duration: 300 }}>
      <div class="sidebar-header">
        <span class="sidebar-title">Menu</span>
        <button class="close-btn" onclick={closeSidebar} aria-label="Close menu">
          <X size={24} weight="bold" />
        </button>
      </div>

      <div class="sidebar-content">
        <button class="menu-item" onclick={() => handleNavigation('/book')}>
          <span class="menu-text">Book Appointment</span>
        </button>

        {#if user?.role === 'faculty_advisor' || user?.role === 'academic_advisor'}
          <button class="menu-item" onclick={() => handleNavigation('/approve')}>
            <span class="menu-text">Approve Requests</span>
          </button>
        {/if}

        <button class="menu-item" onclick={() => handleNavigation('/history')}>
          <span class="menu-text">History</span>
        </button>
      </div>
    </nav>
  {/if}
</div>

<style>
  .nav-container {
    position: relative;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--color-white);
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
  }

  .menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .menu-btn:active {
    transform: scale(0.95);
  }

  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 40;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-right: 1px solid rgba(255, 255, 255, 0.15);
    z-index: 50;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .sidebar-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-white);
    letter-spacing: -0.5px;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-white);
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .sidebar-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  .menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem 1.25rem;
    border: none;
    background: transparent;
    color: var(--color-muted);
    cursor: pointer;
    border-radius: 10px;
    transition: all 0.2s ease;
    text-align: left;
    font-size: 1rem;
    font-weight: 500;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-white);
  }

  .menu-item:active {
    transform: scale(0.98);
  }

  .menu-item:first-child {
    margin-top: 0.5rem;
  }

  .menu-text {
    flex: 1;
    text-align: left;
  }

  @media (max-width: 480px) {
    .sidebar {
      width: 240px;
    }

    .sidebar-header {
      padding: 1.25rem;
    }

    .sidebar-content {
      padding: 0.75rem;
      gap: 0.25rem;
    }

    .menu-item {
      padding: 0.875rem 1rem;
      font-size: 0.95rem;
    }
  }
</style>
