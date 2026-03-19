<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores';
  import { DropdownMenu } from 'bits-ui';
  import { User, Gear, SignOut } from 'phosphor-svelte';

  function handleLogout() {
    currentUser.set(null);
    goto('/');
  }

  function handleProfile() {
    // TODO: Navigate to profile page
    alert('Profile page coming soon!');
  }

  function handleSettings() {
    // TODO: Navigate to settings page
    alert('Settings page coming soon!');
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class="profile-trigger">
    <User size={20} weight="fill" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content class="profile-dropdown" sideOffset={8} align="end">
      <DropdownMenu.Item class="dropdown-item" onclick={handleProfile}>
        <User size={18} />
        <span>Profile</span>
      </DropdownMenu.Item>
      <DropdownMenu.Item class="dropdown-item" onclick={handleSettings}>
        <Gear size={18} />
        <span>Settings</span>
      </DropdownMenu.Item>
      <DropdownMenu.Separator class="dropdown-separator" />
      <DropdownMenu.Item class="dropdown-item logout" onclick={handleLogout}>
        <SignOut size={18} />
        <span>Logout</span>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>

<style>
  :global(.profile-trigger) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: rgba(49, 45, 94, 0.2);
    color: var(--color-accent);
    cursor: pointer;
    transition: all 0.2s;
  }

  :global(.profile-trigger:hover) {
    background: rgba(49, 45, 94, 0.3);
    transform: scale(1.05);
  }

  :global(.profile-trigger[data-state="open"]) {
    background: rgba(49, 45, 94, 0.35);
  }

  :global(.profile-dropdown) {
    min-width: 180px;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    z-index: 50;
    animation: dropdownIn 0.15s ease-out;
  }

  @keyframes dropdownIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(.dropdown-item) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.9rem;
  }

  :global(.dropdown-item:hover),
  :global(.dropdown-item[data-highlighted]) {
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-white);
    outline: none;
  }

  :global(.dropdown-item.logout:hover),
  :global(.dropdown-item.logout[data-highlighted]) {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
  }

  :global(.dropdown-separator) {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 0.5rem 0.5rem;
  }
</style>
