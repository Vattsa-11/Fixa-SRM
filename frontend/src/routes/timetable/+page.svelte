<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores';
  import type { User } from '$lib/stores';
  import SidebarNav from '$lib/components/SidebarNav.svelte';
  import ProfileDropdown from '$lib/components/ProfileDropdown.svelte';
  import MiniTimetable from '$lib/components/MiniTimetable.svelte';
  import DateOrderPicker from '$lib/components/DateOrderPicker.svelte';
  import { onMount } from 'svelte';
  import {PencilSimple, CalendarBlank, Check, X } from 'phosphor-svelte';

  let user = $state<User | null>(null);
  let isEditMode = $state(false);
  let showLeaveCalendar = $state(false);
  let selectedLeaveDates = $state<string[]>([]);
  let tempLeaveDate = $state('');

  onMount(() => {
    const unsubscribe = currentUser.subscribe(value => {
      user = value;
      if (!value) {
        goto('/');
      } else if (value.role !== 'academic_advisor') {
        // Only academic advisors can access timetable
        goto('/');
      }
    });

    return () => {
      unsubscribe();
    };
  });

  function toggleEditMode() {
    isEditMode = !isEditMode;
  }

  function handlePutLeave() {
    showLeaveCalendar = !showLeaveCalendar;
  }

  function handleLeaveDateSelect() {
    if (tempLeaveDate && !selectedLeaveDates.includes(tempLeaveDate)) {
      selectedLeaveDates = [...selectedLeaveDates, tempLeaveDate];
      tempLeaveDate = '';
      showLeaveCalendar = false;
    }
  }

  function removeLeaveDate(date: string) {
    selectedLeaveDates = selectedLeaveDates.filter(d => d !== date);
  }

  function formatLeaveDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
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
    <div class="timetable-container">
      <div class="page-header">
        <h1 class="page-title">My Timetable</h1>
        <p class="page-subtitle">
          {#if isEditMode}
            Click on time slots to freeze them (they won't be available for booking)
          {:else}
            Your weekly appointment schedule
          {/if}
        </p>
      </div>

      <div class="timetable-card">
        <MiniTimetable {isEditMode} />
      </div>

      <!-- Leave Dates Section -->
      {#if selectedLeaveDates.length > 0}
        <div class="leave-dates-section">
          <h3 class="leave-title">Leave Dates</h3>
          <div class="leave-dates-list">
            {#each selectedLeaveDates as date}
              <div class="leave-date-chip">
                <span>{formatLeaveDate(date)}</span>
                <button class="remove-btn" onclick={() => removeLeaveDate(date)} aria-label="Remove leave date">
                  <X size={16} weight="bold" />
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Buttons -->
      <div class="buttons-container">
        <button class="action-btn edit-btn" onclick={toggleEditMode}>
          {#if isEditMode}
            <Check size={20} weight="bold" />
            Save Timetable
          {:else}
            <PencilSimple size={20} weight="bold" />
            Edit Timetable
          {/if}
        </button>

        <div class="leave-button-container">
          <button class="action-btn leave-btn" onclick={handlePutLeave}>
            <CalendarBlank size={20} weight="bold" />
            Put Leave
          </button>

          {#if showLeaveCalendar}
            <!-- Backdrop -->
            <div class="calendar-backdrop" onclick={() => (showLeaveCalendar = false)}></div>

            <div class="leave-calendar-popup">
              <h4>Select Leave Date</h4>
              <DateOrderPicker
                bind:selectedDate={tempLeaveDate}
                onDateSelect={handleLeaveDateSelect}
              />
              <div class="calendar-actions">
                <button class="confirm-btn" onclick={handleLeaveDateSelect} disabled={!tempLeaveDate}>
                  Add Leave
                </button>
                <button class="cancel-btn" onclick={() => (showLeaveCalendar = false)}>
                  Cancel
                </button>
              </div>
            </div>
          {/if}
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
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
  }

  .timetable-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;
    min-height: 0;
  }

  .page-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-white);
    margin: 0;
  }

  .page-subtitle {
    font-size: 1rem;
    color: var(--color-muted);
    margin: 0;
    min-height: 1.5rem;
  }

  .timetable-card {
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    flex: 1;
    min-height: 600px;
    display: flex;
    flex-direction: column;
  }

  .leave-dates-section {
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
  }

  .leave-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-white);
    margin: 0 0 0.75rem 0;
  }

  .leave-dates-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .leave-date-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-white);
  }

  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: #fca5a5;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .remove-btn:hover {
    background: rgba(239, 68, 68, 0.2);
  }

  .buttons-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 200px;
    padding: 1rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .edit-btn {
    background: var(--color-accent);
    color: var(--color-white);
  }

  .edit-btn:hover {
    background: #312d5e;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(239, 131, 84, 0.3);
  }

  .leave-button-container {
    position: relative;
    flex: 1;
    min-width: 200px;
  }

  .leave-btn {
    width: 100%;
    background: rgba(134, 239, 172, 0.15);
    border: 1px solid rgba(134, 239, 172, 0.3);
    color: #86efac;
  }

  .leave-btn:hover {
    background: rgba(134, 239, 172, 0.25);
    transform: translateY(-2px);
  }

  .calendar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .leave-calendar-popup {
    position: fixed;
    bottom: auto;
    top: 50%;
    right: auto;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
    background: rgb(0, 0, 0);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 1.5rem;
    min-width: 420px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .leave-calendar-popup h4 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-white);
  }

  .calendar-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .confirm-btn,
  .cancel-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .confirm-btn {
    background: var(--color-accent);
    color: var(--color-white);
  }

  .confirm-btn:hover:not(:disabled) {
    background: #312d5e;
  }

  .confirm-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cancel-btn {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-white);
  }

  .cancel-btn:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  .action-btn:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .header {
      padding: 1rem;
    }

    .main-content {
      padding: 1rem;
    }

    .page-title {
      font-size: 1.5rem;
    }

    .page-subtitle {
      font-size: 0.875rem;
    }

    .timetable-card {
      padding: 1rem;
      min-height: 500px;
    }

    .action-btn {
      padding: 0.875rem 1rem;
      font-size: 0.95rem;
      min-width: 180px;
    }

    .leave-calendar-popup {
      min-width: 380px;
      background: rgba(0, 0, 0, 0.9);
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

    .timetable-container {
      gap: 1rem;
    }

    .page-title {
      font-size: 1.25rem;
    }

    .timetable-card {
      padding: 0.75rem;
      min-height: 450px;
    }

    .action-btn {
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      gap: 0.5rem;
      min-width: 150px;
    }

    .buttons-container {
      flex-direction: column;
    }

    .leave-button-container {
      width: 100%;
    }

    .leave-calendar-popup {
      min-width: 340px;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.9);
    }
  }
</style>
