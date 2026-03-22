<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores';
  import type { User } from '$lib/stores';
  import SidebarNav from '$lib/components/SidebarNav.svelte';
  import ProfileDropdown from '$lib/components/ProfileDropdown.svelte';
  import { onMount } from 'svelte';

  // Subscribe to currentUser store
  let user = $state<User | null>(null);
  let roomNumber = $state('');

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
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">{user?.name?.[0]}</div>
        <div class="profile-info">
          <h1 class="profile-name">{user?.name}</h1>
          <p class="profile-email">{user?.email}</p>
          <p class="profile-role">
            {#if user?.role === 'student'}
              Student
            {:else if user?.role === 'faculty_advisor'}
              Faculty Advisor
            {:else if user?.role === 'academic_advisor'}
              Academic Advisor
            {/if}
          </p>
        </div>
      </div>

      <!-- Account Information -->
      <div class="overview-section">
        <div class="info-card">
          <h3>Account Information</h3>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">{user?.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{user?.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Role:</span>
            <span class="info-value">
              {#if user?.role === 'student'}
                Student
              {:else if user?.role === 'faculty_advisor'}
                Faculty Advisor
              {:else if user?.role === 'academic_advisor'}
                Academic Advisor
              {/if}
            </span>
          </div>
        </div>

        <div class="info-card">
          <h3>Default Room Number</h3>
          <div class="room-input-group">
            <input
              type="text"
              bind:value={roomNumber}
              placeholder="Enter your default room number"
              class="room-input-field"
            />
            <p class="room-hint">This will be used as default when scheduling appointments</p>
          </div>
        </div>
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
    overflow-y: auto;
  }

  .profile-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: rgba(49, 45, 94, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-white);
    flex-shrink: 0;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .profile-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-white);
    margin: 0;
  }

  .profile-email {
    font-size: 0.95rem;
    color: var(--color-muted);
    margin: 0;
  }

  .profile-role {
    font-size: 0.875rem;
    color: var(--color-accent);
    font-weight: 500;
    margin: 0;
  }

  .overview-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .info-card {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
  }

  .info-card h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-white);
  }

  .info-row {
    display: flex;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    flex: 0 0 120px;
    color: var(--color-muted);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .info-value {
    flex: 1;
    color: var(--color-white);
    font-size: 0.875rem;
  }

  .room-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .room-input-field {
    padding: 0.875rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-white);
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .room-input-field::placeholder {
    color: rgba(191, 192, 192, 0.4);
  }

  .room-input-field:focus {
    outline: none;
    border-color: var(--color-accent);
    background: rgba(255, 255, 255, 0.08);
  }

  .room-hint {
    font-size: 0.75rem;
    color: var(--color-muted);
    margin: 0;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 1rem;
    }

    .profile-header {
      padding: 1rem;
      gap: 1rem;
    }

    .profile-avatar {
      width: 60px;
      height: 60px;
      font-size: 1.5rem;
    }

    .profile-name {
      font-size: 1.25rem;
    }

    .info-label {
      flex: 0 0 100px;
    }
  }

  @media (max-width: 480px) {
    .header {
      padding: 0.75rem 1rem;
    }

    .user-name {
      display: none;
    }

    .main-content {
      padding: 0.75rem;
    }

    .profile-container {
      gap: 1.5rem;
    }

    .profile-header {
      flex-direction: column;
      text-align: center;
      padding: 1.5rem 1rem;
    }

    .profile-avatar {
      width: 70px;
      height: 70px;
    }

    .info-card {
      padding: 1rem;
    }

    .info-row {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem 0;
    }

    .info-label {
      flex: none;
    }
  }
</style>
