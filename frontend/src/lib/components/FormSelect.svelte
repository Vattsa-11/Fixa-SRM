<script lang="ts">
  import { Select } from 'bits-ui';
  import { CaretDown, Check } from 'phosphor-svelte';

  interface Option {
    value: string;
    label: string;
  }

  let {
    options,
    value = $bindable(''),
    placeholder = 'Select an option',
    icon: Icon = null
  }: {
    options: Option[];
    value?: string;
    placeholder?: string;
    icon?: any;
  } = $props();

  let selectedLabel = $derived(
    options.find(opt => opt.value === value)?.label || ''
  );
</script>

<Select.Root type="single" bind:value>
  <Select.Trigger class="select-trigger">
    {#if Icon}
      <Icon size={16} weight="bold" class="trigger-icon" />
    {/if}
    <span class="trigger-text" class:placeholder={!value}>
      {selectedLabel || placeholder}
    </span>
    <CaretDown size={16} class="trigger-caret" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content class="select-content" sideOffset={8}>
      {#each options as option}
        <Select.Item value={option.value} class="select-item">
          <span>{option.label}</span>
          <Select.ItemIndicator>
            <Check size={16} weight="bold" />
          </Select.ItemIndicator>
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Portal>
</Select.Root>

<style>
  :global(.select-trigger) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-white);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  :global(.select-trigger:hover) {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.07);
  }

  :global(.select-trigger:focus),
  :global(.select-trigger[data-state="open"]) {
    outline: none;
    border-color: var(--color-accent);
    background: rgba(255, 255, 255, 0.08);
  }

  :global(.select-trigger .trigger-icon) {
    color: var(--color-accent);
    flex-shrink: 0;
  }

  :global(.select-trigger .trigger-text) {
    flex: 1;
  }

  :global(.select-trigger .trigger-text.placeholder) {
    color: rgba(191, 192, 192, 0.5);
  }

  :global(.select-trigger .trigger-caret) {
    color: var(--color-muted);
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  :global(.select-trigger[data-state="open"] .trigger-caret) {
    transform: rotate(180deg);
  }

  :global(.select-content) {
    width: var(--bits-select-trigger-width);
    padding: 0.5rem;
    background: rgba(30, 35, 50, 0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    z-index: 50;
    animation: selectIn 0.15s ease-out;
  }

  @keyframes selectIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(.select-item) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.95rem;
  }

  :global(.select-item:hover),
  :global(.select-item[data-highlighted]) {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-white);
    outline: none;
  }

  :global(.select-item[data-state="checked"]) {
    color: var(--color-accent);
  }

  :global(.select-item[data-state="checked"]:hover),
  :global(.select-item[data-state="checked"][data-highlighted]) {
    color: var(--color-accent);
  }
</style>
