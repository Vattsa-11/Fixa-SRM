<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser, getDayOrderFromDate, MOCK_USERS } from '$lib/stores';
  import type { User } from '$lib/stores';
  import SidebarNav from '$lib/components/SidebarNav.svelte';
  import ProfileDropdown from '$lib/components/ProfileDropdown.svelte';
  import FormSelect from '$lib/components/FormSelect.svelte';
  import DateOrderPicker from '$lib/components/DateOrderPicker.svelte';
  import { onMount } from 'svelte';
  import { MagnifyingGlass, Clock, PaperPlaneTilt, X } from 'phosphor-svelte';

  let searchQuery = $state('');
  let subject = $state('');
  let reason = $state('');
  let date = $state('');
  let timeSlot = $state('');
  let dayOrder = $state('');
  let isSubmitting = $state(false);
  let user = $state<{ name: string; role: string } | null>(null);
  let searchResults = $state<User[]>([]);
  let selectedAdvisor = $state<User | null>(null);

  const subjectOptions = [
    { value: 'report', label: 'Report' },
    { value: 'projects', label: 'Projects' },
    { value: 'attendance', label: 'Attendance' },
    { value: 'internship', label: 'Internship' },
    { value: 'others', label: 'Others' }
  ];

  const timeSlotOptions = [
    { value: 'slot1', label: '8:00 - 8:50' },
    { value: 'slot2', label: '8:50 - 9:40' },
    { value: 'slot3', label: '9:40 - 10:30' },
    { value: 'slot4', label: '10:30 - 11:20' },
    { value: 'slot5', label: '11:20 - 12:10' },
    { value: 'slot6', label: '12:10 - 1:00' },
    { value: 'slot7', label: '1:00 - 1:50' },
    { value: 'slot8', label: '1:50 - 2:40' },
    { value: 'slot9', label: '2:40 - 3:30' },
    { value: 'slot10', label: '3:30 - 4:20' },
    { value: 'slot11', label: '4:20 - 5:00' }
  ];

  function isToday(dateStr: string): boolean {
    if (!dateStr) return false;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  }

  function parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function getAvailableTimeSlots(): typeof timeSlotOptions {
    if (!isToday(date)) {
      // If not today, all slots are available
      return timeSlotOptions;
    }

    // Get current time in minutes since midnight
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Filter slots where end time is after current time
    return timeSlotOptions.filter(slot => {
      const endTime = slot.label.split(' - ')[1];
      const endMinutes = parseTimeToMinutes(endTime);
      return endMinutes > currentMinutes;
    });
  }

  let availableSlots = $state<typeof timeSlotOptions>(timeSlotOptions);

  $effect(() => {
    // Explicitly depend on date changes
    if (date || date === '') {
      availableSlots = getAvailableTimeSlots();
      // Reset timeSlot if it's not in available slots
      if (timeSlot && !availableSlots.find(slot => slot.value === timeSlot)) {
        timeSlot = '';
      }
    }
  });

  function handleSearch() {
    if (searchQuery.trim()) {
      // Search for academic advisors by name or email
      const query = searchQuery.toLowerCase();
      searchResults = MOCK_USERS.filter(u =>
        u.role === 'academic_advisor' &&
        (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
      );
    } else {
      searchResults = [];
    }
  }

  function selectAdvisor(advisor: User) {
    selectedAdvisor = advisor;
    searchResults = [];
    searchQuery = advisor.name;
  }

  function clearSearch() {
    selectedAdvisor = null;
    searchQuery = '';
    searchResults = [];
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    alert('Appointment request submitted! (Mock)');

    // Reset form
    clearSearch();
    subject = '';
    reason = '';
    date = '';
    dayOrder = '';
    timeSlot = '';
    isSubmitting = false;
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
    <h1 class="page-title">Book Appointment</h1>
    <p class="page-subtitle">Request a meeting with your Academic Advisor</p>

    <form class="booking-form" onsubmit={handleSubmit}>
      <!-- Search Academic Advisor -->
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            type="text"
            bind:value={searchQuery}
            onkeyup={handleSearch}
            placeholder="Search Faculty Name..."
            class="search-input"
          />
          <button
            type="button"
            class="search-btn"
            onclick={handleSearch}
            aria-label="Search"
          >
            <MagnifyingGlass size={20} weight="bold" />
          </button>
        </div>

        <!-- Search Results -->
        {#if searchResults.length > 0}
          <div class="search-results">
            {#each searchResults as result}
              <button
                type="button"
                class="result-item"
                onclick={() => selectAdvisor(result)}
              >
                {#if result.profilePic}
                  <img src={result.profilePic} alt={result.name} class="result-pic" />
                {/if}
                <div class="result-info">
                  <div class="result-name">{result.name}</div>
                  <div class="result-email">{result.email}</div>
                </div>
              </button>
            {/each}
          </div>
        {/if}

        <!-- Selected Advisor -->
        {#if selectedAdvisor}
          <div class="selected-advisor">
            <div class="selected-header">
              <span class="selected-label">Selected Advisor</span>
              <button type="button" class="clear-btn" onclick={clearSearch} aria-label="Clear">
                <X size={16} />
              </button>
            </div>
            <div class="selected-content">
              {#if selectedAdvisor.profilePic}
                <img src={selectedAdvisor.profilePic} alt={selectedAdvisor.name} class="selected-pic" />
              {/if}
              <div class="selected-info">
                <div class="selected-name">{selectedAdvisor.name}</div>
                <div class="selected-email">{selectedAdvisor.email}</div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Subject -->
      <div class="form-group">
        <label>Subject</label>
        <FormSelect
          options={subjectOptions}
          bind:value={subject}
          placeholder="Select subject"
        />
      </div>

      <!-- Full Reason -->
      <div class="form-group">
        <label for="reason">Full Reason</label>
        <textarea
          id="reason"
          bind:value={reason}
          placeholder="Describe the purpose of your appointment..."
          rows="4"
          required
          class="form-textarea"
        ></textarea>
      </div>

      <!-- Date & Day Order Combined -->
      <div class="form-group">
        <label for="date">
          <MagnifyingGlass size={16} weight="bold" class="label-icon" />
          Select Date
        </label>
        <DateOrderPicker bind:value={date} />
        {#if dayOrder}
          <div class="day-order-display">
            Day Order: <strong>{dayOrder}</strong>
          </div>
        {/if}
      </div>

      <!-- Time Slot -->
      <div class="form-group">
        <label>
          <Clock size={16} weight="bold" class="label-icon" />
          Time Slot
        </label>
        {#if availableSlots.length === 0 && isToday(date)}
          <div class="no-slots-message">
            No time slots available for today. All slots have ended. Please select a future date.
          </div>
        {:else}
          <FormSelect
            options={availableSlots}
            bind:value={timeSlot}
            placeholder="Select time"
            icon={Clock}
          />
        {/if}
      </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn" disabled={isSubmitting}>
        {#if isSubmitting}
          <span class="spinner"></span>
          Submitting...
        {:else}
          <PaperPlaneTilt size={20} weight="bold" />
          Request Appointment
        {/if}
      </button>
    </form>
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
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
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

  .booking-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .search-container {
    position: relative;
  }

  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 3.5rem 0.875rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-white);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-accent);
    background: rgba(255, 255, 255, 0.08);
  }

  .search-input::placeholder {
    color: rgba(191, 192, 192, 0.5);
  }

  .search-btn {
    position: absolute;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: var(--color-accent);
    color: var(--color-white);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .search-btn:hover {
    background: #312d5e;
  }

  .search-btn:active {
    transform: scale(0.95);
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 0.5rem;
    z-index: 50;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }

  .result-item:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-white);
  }

  .result-pic {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .result-info {
    min-width: 0;
    flex: 1;
  }

  .result-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-white);
  }

  .result-email {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  .selected-advisor {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(49, 45, 94, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
  }

  .selected-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .selected-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-btn:hover {
    background: rgba(252, 165, 165, 0.2);
    color: #fca5a5;
  }

  .selected-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .selected-pic {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  .selected-info {
    min-width: 0;
    flex: 1;
  }

  .selected-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-white);
  }

  .selected-email {
    font-size: 0.8rem;
    color: var(--color-muted);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
  }

  .form-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .form-group label :global(.label-icon) {
    color: var(--color-accent);
  }

  .form-input,
  .form-textarea {
    padding: 0.875rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-white);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--color-accent);
    background: rgba(255, 255, 255, 0.08);
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: rgba(191, 192, 192, 0.5);
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .char-count {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 0.75rem;
    color: rgba(191, 192, 192, 0.5);
  }

  .day-order-display {
    margin-top: 0.75rem;
    padding: 0.75rem 1rem;
    background: rgba(239, 131, 84, 0.1);
    border: 1px solid rgba(239, 131, 84, 0.3);
    border-radius: 8px;
    font-size: 0.875rem;
    color: var(--color-accent);
    font-weight: 500;
  }

  .no-slots-message {
    padding: 0.875rem 1rem;
    border-radius: 10px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    font-size: 0.875rem;
    text-align: center;
    font-weight: 500;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .submit-btn {
    margin-top: 0.5rem;
    padding: 1rem;
    border: none;
    border-radius: 10px;
    background: var(--color-accent);
    color: var(--color-white);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .submit-btn:hover:not(:disabled) {
    background: #312d5e;
    transform: translateY(-1px);
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--color-white);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 480px) {
    .main-content {
      padding: 1rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .user-name {
      display: none;
    }
  }

  @media (max-width: 360px) {
    .main-content {
      padding: 0.75rem;
    }

    .page-title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .page-subtitle {
      font-size: 0.75rem;
      margin-bottom: 1rem;
    }

    .booking-form {
      gap: 1rem;
    }

    .search-input-wrapper {
      flex-direction: row;
    }

    .search-input {
      padding: 0.75rem 3.2rem 0.75rem 0.75rem;
      font-size: 0.9rem;
    }

    .search-btn {
      width: 32px;
      height: 32px;
    }

    .form-group label {
      font-size: 0.8rem;
    }

    .form-input,
    .form-textarea {
      padding: 0.75rem 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
    }

    .form-textarea {
      min-height: 80px;
      rows: 3;
    }

    .char-count {
      font-size: 0.7rem;
    }

    .day-order-display {
      margin-top: 0.5rem;
      padding: 0.6rem 0.75rem;
      font-size: 0.8rem;
      border-radius: 6px;
    }

    .submit-btn {
      padding: 0.9rem;
      font-size: 0.95rem;
      gap: 0.4rem;
    }

    .submit-btn :global(svg) {
      width: 18px;
      height: 18px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border-width: 1px;
    }
  }
</style>
