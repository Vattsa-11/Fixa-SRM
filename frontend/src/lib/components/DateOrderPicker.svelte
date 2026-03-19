<script lang="ts">
  import { getDayOrderFromDate } from '$lib/stores';
  import { CalendarBlank, CaretLeft, CaretRight } from 'phosphor-svelte';

  interface Props {
    value: string;
  }

  let { value = $bindable() }: Props = $props();

  let currentMonth = $state(new Date());
  let showCalendar = $state(false);

  function getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function isToday(date: Date, compareDate: Date): boolean {
    return (
      date.getDate() === compareDate.getDate() &&
      date.getMonth() === compareDate.getMonth() &&
      date.getFullYear() === compareDate.getFullYear()
    );
  }

  function isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  }

  function formatDisplayDate(dateStr: string): string {
    if (!dateStr) return 'Select date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function handleDateClick(day: number) {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;
    value = dateStr;
    showCalendar = false;
  }

  function previousMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
  }

  function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  $effect(() => {
    // Sync month with selected value if value changes
    if (value) {
      const date = new Date(value);
      currentMonth = new Date(date.getFullYear(), date.getMonth());
    }
  });
</script>

<div class="date-picker-wrapper">
  <button
    type="button"
    class="date-picker-trigger"
    onclick={() => (showCalendar = !showCalendar)}
  >
    <CalendarBlank size={16} weight="bold" />
    <span>{formatDisplayDate(value)}</span>
  </button>

  {#if showCalendar}
    <div class="calendar-popup">
      <div class="calendar-header">
        <button type="button" class="nav-btn" onclick={previousMonth}>
          <CaretLeft size={16} />
        </button>
        <h3>
          {monthNames[currentMonth.getMonth()]}
          {currentMonth.getFullYear()}
        </h3>
        <button type="button" class="nav-btn" onclick={nextMonth}>
          <CaretRight size={16} />
        </button>
      </div>

      <div class="calendar-weekdays">
        {#each daysOfWeek as day}
          <div class="weekday">{day}</div>
        {/each}
      </div>

      <div class="calendar-days">
        {#each Array(getFirstDayOfMonth(currentMonth)) as _}
          <div class="day empty"></div>
        {/each}

        {#each Array(getDaysInMonth(currentMonth)) as _, i}
          {@const day = i + 1}
          {@const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)}
          {@const year = currentMonth.getFullYear()}
          {@const month = String(currentMonth.getMonth() + 1).padStart(2, '0')}
          {@const dayStr = String(day).padStart(2, '0')}
          {@const dateStr = `${year}-${month}-${dayStr}`}
          {@const dayOrder = getDayOrderFromDate(dateStr)}
          {@const isSelected = isToday(date, value ? new Date(value) : new Date(-1))}
          {@const isWeekend = date.getDay() === 0 || date.getDay() === 6}
          {@const isPast = isPastDate(date)}

          <button
            type="button"
            class="day"
            class:selected={isSelected}
            class:weekend={isWeekend}
            class:has-do={dayOrder}
            class:disabled={isPast}
            disabled={isPast}
            onclick={() => handleDateClick(day)}
          >
            <div class="day-number">{day}</div>
            {#if dayOrder}
              <div class="day-order">{dayOrder}</div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .date-picker-wrapper {
    position: relative;
    width: 100%;
  }

  .date-picker-trigger {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-white);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
  }

  .date-picker-trigger:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--color-accent);
  }

  .date-picker-trigger:focus {
    outline: none;
    border-color: var(--color-accent);
    background: rgba(255, 255, 255, 0.08);
  }

  .calendar-popup {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    background: rgba(30, 35, 50, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 1rem;
    z-index: 50;
    width: 100%;
    max-width: 320px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .calendar-header h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-white);
    margin: 0;
    flex: 1;
    text-align: center;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .nav-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--color-accent);
  }

  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .weekday {
    text-align: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-muted);
    padding: 0.4rem 0;
  }

  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.35rem;
  }

  .day {
    min-height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.03);
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0.3rem;
    font-size: 0.75rem;
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
  }

  .day.empty {
    background: transparent;
    cursor: default;
    border: none;
  }

  .day.disabled {
    background: rgba(255, 255, 255, 0.01);
    color: rgba(191, 192, 192, 0.3);
    cursor: not-allowed;
    border-color: transparent;
  }

  .day.disabled:hover {
    background: rgba(255, 255, 255, 0.01);
    border-color: transparent;
  }

  .day:not(.empty):not(.disabled):hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .day.selected {
    background: var(--color-accent);
    color: var(--color-white);
    border-color: var(--color-accent);
    font-weight: 600;
  }

  .day.selected:hover {
    background: #e5723f;
  }

  .day.weekend:not(.selected) {
    color: rgba(239, 131, 84, 0.7);
  }

  .day.has-do:not(.selected) {
    background: rgba(167, 139, 250, 0.1);
    border: 1px solid rgba(167, 139, 250, 0.3);
  }

  .day-number {
    font-weight: 500;
    line-height: 1;
  }

  .day-order {
    font-size: 0.6rem;
    color: var(--color-accent);
    font-weight: 600;
    line-height: 1;
  }

  .day.selected .day-order {
    color: var(--color-white);
  }

  @media (max-width: 480px) {
    .calendar-popup {
      max-width: 280px;
      padding: 0.75rem;
    }

    .calendar-header {
      margin-bottom: 0.75rem;
    }

    .calendar-header h3 {
      font-size: 0.85rem;
    }

    .nav-btn {
      width: 24px;
      height: 24px;
    }

    .calendar-days {
      gap: 0.3rem;
    }

    .day {
      padding: 0.2rem;
      font-size: 0.7rem;
    }

    .weekday {
      font-size: 0.65rem;
      padding: 0.3rem 0;
    }

    .day-order {
      font-size: 0.55rem;
    }
  }

  @media (max-width: 360px) {
    .calendar-popup {
      max-width: calc(100vw - 2rem);
      padding: 0.5rem;
    }

    .calendar-header {
      margin-bottom: 0.5rem;
    }

    .calendar-header h3 {
      font-size: 0.8rem;
    }

    .calendar-weekdays {
      margin-bottom: 0.3rem;
      gap: 0.2rem;
    }

    .calendar-days {
      gap: 0.2rem;
    }

    .weekday {
      font-size: 0.6rem;
      padding: 0.25rem 0;
    }

    .day {
      padding: 0.15rem;
      font-size: 0.65rem;
    }

    .day-number {
      font-size: 0.65rem;
    }

    .day-order {
      font-size: 0.5rem;
    }
  }
</style>
