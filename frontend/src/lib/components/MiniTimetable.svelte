<script lang="ts">
  // Time slots: 50-minute periods from 8:00 AM to 5:00 PM
  const timeSlots = [
    '8:00 - 8:50',
    '8:50 - 9:40',
    '9:40 - 10:30',
    '10:30 - 11:20',
    '11:20 - 12:10',
    '12:10 - 1:00',
    '1:00 - 1:50',
    '1:50 - 2:40',
    '2:40 - 3:30',
    '3:30 - 4:20',
    '4:20 - 5:00'
  ];

  const dayOrders = ['D.O 1', 'D.O 2', 'D.O 3', 'D.O 4', 'D.O 5'];
</script>

<div class="timetable-container">
  <div class="timetable">
    <div class="corner"></div>
    {#each dayOrders as dayOrder}
      <div class="day-header">{dayOrder}</div>
    {/each}

    {#each timeSlots as slot}
      <div class="time-label">{slot}</div>
      {#each dayOrders as dayOrder}
        <div class="slot"></div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .timetable-container {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    overflow-x: auto;
  }

  .timetable {
    display: grid;
    grid-template-columns: 120px repeat(5, 1fr);
    gap: 1px;
    background: rgba(255, 255, 255, 0.05);
    padding: 1px;
    border-radius: 8px;
    min-width: 500px;
  }

  .corner {
    background: rgba(255, 255, 255, 0.02);
    min-height: 40px;
    display: flex;
    align-items: center;
    padding: 0.5rem;
  }

  .day-header {
    background: rgba(49, 45, 94, 0.15);
    color: var(--color-white);
    font-weight: 600;
    font-size: 0.85rem;
    padding: 0.75rem 0.5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .time-label {
    background: rgba(255, 255, 255, 0.02);
    color: var(--color-muted);
    font-size: 0.75rem;
    padding: 0.5rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .slot {
    background: rgba(255, 255, 255, 0.03);
    min-height: 60px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: background 0.2s;
  }

  .slot:hover {
    background: rgba(49, 45, 94, 0.1);
  }

  @media (max-width: 768px) {
    .timetable {
      grid-template-columns: 90px repeat(3, 1fr);
    }

    .day-header {
      font-size: 0.75rem;
      padding: 0.5rem 0.25rem;
    }

    .time-label {
      font-size: 0.65rem;
      padding: 0.25rem;
    }

    .slot {
      min-height: 50px;
    }
  }
</style>
