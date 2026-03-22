<script lang="ts">
  interface Props {
    isEditMode?: boolean;
  }

  const { isEditMode = false }: Props = $props();

  // Time slots: 50-minute periods from 8:00 AM to 5:00 PM
  const timeSlots = [
    '8:00-8:50',
    '8:50-9:40',
    '9:40-10:30',
    '10:30-11:20',
    '11:20-12:10',
    '12:10-1:00',
    '1:00-1:50',
    '1:50-2:40',
    '2:40-3:30',
    '3:30-4:20',
    '4:20-5:00'
  ];

  const dayOrders = ['D.O 1', 'D.O 2', 'D.O 3', 'D.O 4', 'D.O 5'];

  // Track frozen slots (format: "dayOrder-timeSlot")
  let frozenSlots = $state<Set<string>>(new Set());

  let isDragging = $state(false);
  let startX = $state(0);
  let scrollLeft = $state(0);
  let container: HTMLElement | null = $state.snapshot(null);

  function handleMouseDown(e: MouseEvent) {
    if (!(e.target instanceof HTMLElement)) return;
    if (isEditMode) return; // Don't drag in edit mode
    isDragging = true;
    startX = e.pageX - (container?.offsetLeft || 0);
    scrollLeft = container?.scrollLeft || 0;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging || !container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  }

  function handleTouchStart(e: TouchEvent) {
    if (!container || isEditMode) return;
    isDragging = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  }

  function handleTouchEnd() {
    isDragging = false;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isDragging || !container) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  }

  function handleSlotClick(dayOrder: string, timeSlot: string) {
    if (!isEditMode) return;

    const slotKey = `${dayOrder}-${timeSlot}`;
    if (frozenSlots.has(slotKey)) {
      frozenSlots.delete(slotKey);
    } else {
      frozenSlots.add(slotKey);
    }
    frozenSlots = new Set(frozenSlots); // Trigger reactivity
  }

  function isSlotFrozen(dayOrder: string, timeSlot: string): boolean {
    return frozenSlots.has(`${dayOrder}-${timeSlot}`);
  }
</script>

<div
  class="timetable-container"
  bind:this={container}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseUp}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
  ontouchmove={handleTouchMove}
  class:is-dragging={isDragging}
  class:edit-mode={isEditMode}
>
  <div class="timetable">
    <!-- Corner cell -->
    <div class="corner"></div>

    <!-- Time slot headers (columns) -->
    {#each timeSlots as slot}
      <div class="time-header">{slot}</div>
    {/each}

    <!-- Day order rows -->
    {#each dayOrders as dayOrder}
      <div class="day-label">{dayOrder}</div>
      {#each timeSlots as slot}
        <button
          class="slot"
          class:frozen={isSlotFrozen(dayOrder, slot)}
          class:clickable={isEditMode}
          onclick={() => handleSlotClick(dayOrder, slot)}
          disabled={!isEditMode}
        >
          {#if isSlotFrozen(dayOrder, slot)}
            <span class="frozen-icon">🔒</span>
          {/if}
        </button>
      {/each}
    {/each}
  </div>
</div>

<style>
  .timetable-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    user-select: none;
  }

  .timetable-container.is-dragging {
    cursor: grabbing;
    scroll-behavior: auto;
  }

  .timetable-container.edit-mode {
    cursor: default;
  }

  .timetable-container::-webkit-scrollbar {
    height: 8px;
  }

  .timetable-container::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  .timetable-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  .timetable-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .timetable {
    display: grid;
    grid-template-columns: 90px repeat(11, minmax(100px, 1fr));
    gap: 0;
    background: transparent;
    height: 100%;
    min-height: 100%;
  }

  .corner {
    background: rgba(49, 45, 94, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 0.5rem;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--color-white);
    min-height: 70px;
  }

  .time-header {
    background: rgba(49, 45, 94, 0.15);
    color: var(--color-white);
    font-weight: 600;
    font-size: 0.85rem;
    padding: 1.5rem 0.5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    white-space: nowrap;
    line-height: 1.3;
    min-height: 70px;
  }

  .day-label {
    background: rgba(49, 45, 94, 0.15);
    color: var(--color-white);
    font-weight: 600;
    font-size: 0.95rem;
    padding: 1.5rem 0.5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    min-height: 90px;
  }

  .slot {
    background: rgba(255, 255, 255, 0.03);
    border: none;
    transition: all 0.2s ease;
    cursor: grab;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 90px;
    box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.05);
  }

  .slot:not(:disabled):hover {
    background: rgba(49, 45, 94, 0.15);
  }

  .slot.clickable {
    cursor: pointer;
  }

  .slot.clickable:hover {
    background: rgba(239, 131, 84, 0.1);
  }

  .slot.frozen {
    background: rgba(239, 68, 68, 0.15);
    cursor: pointer;
  }

  .slot.frozen:hover {
    background: rgba(239, 68, 68, 0.25);
  }

  .frozen-icon {
    font-size: 1.5rem;
  }

  .slot:active:not(.frozen) {
    cursor: grabbing;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .timetable {
      grid-template-columns: 75px repeat(11, minmax(80px, 1fr));
    }

    .corner {
      padding: 1.25rem 0.4rem;
      font-size: 0.8rem;
      min-height: 65px;
    }

    .time-header {
      font-size: 0.8rem;
      padding: 1.25rem 0.4rem;
      min-height: 65px;
    }

    .day-label {
      font-size: 0.85rem;
      padding: 1.25rem 0.4rem;
      min-height: 80px;
    }

    .slot {
      min-height: 80px;
    }

    .frozen-icon {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .timetable {
      grid-template-columns: 65px repeat(11, minmax(70px, 1fr));
    }

    .corner {
      padding: 1rem 0.3rem;
      font-size: 0.75rem;
      min-height: 60px;
    }

    .time-header {
      font-size: 0.75rem;
      padding: 1rem 0.3rem;
      min-height: 60px;
    }

    .day-label {
      font-size: 0.8rem;
      padding: 1rem 0.3rem;
      min-height: 70px;
    }

    .slot {
      min-height: 70px;
    }

    .frozen-icon {
      font-size: 0.9rem;
    }
  }
</style>
