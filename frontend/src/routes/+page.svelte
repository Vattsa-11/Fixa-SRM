<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentUser, MOCK_USERS } from '$lib/stores';
  import { Eye, EyeSlash } from 'phosphor-svelte';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let isLoading = $state(false);
  let errorMessage = $state('');

  async function handleLogin(e: Event) {
    e.preventDefault();
    errorMessage = '';
    isLoading = true;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (user) {
      currentUser.set({
        email: user.email,
        name: user.name,
        role: user.role
      });

      // Redirect based on role
      if (user.role === 'academic_advisor') {
        goto('/advisor');
      } else {
        goto('/book');
      }
    } else {
      errorMessage = 'Invalid email or password';
    }

    isLoading = false;
  }
</script>

<main class="login-container">
  <div class="login-card">
    <header class="login-header">
      <img src="/logo.webp" alt="Fixa Logo" class="logo-image" />
      <h1 class="logo">Fixa</h1>
      <p class="tagline">Appointment Booker</p>
      <span class="byline">by SRM</span>
    </header>

    <form class="login-form" onsubmit={handleLogin}>
      {#if errorMessage}
        <div class="error-message">
          {errorMessage}
        </div>
      {/if}

      <div class="input-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          placeholder="Enter your email"
          required
          autocomplete="email"
        />
      </div>

      <div class="input-group">
        <label for="password">Password</label>
        <div class="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            bind:value={password}
            placeholder="Enter your password"
            required
            autocomplete="current-password"
          />
          <button
            type="button"
            class="password-toggle"
            onclick={() => showPassword = !showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <EyeSlash size={20} />
            {:else}
              <Eye size={20} />
            {/if}
          </button>
        </div>
      </div>

      <button type="submit" class="login-btn" disabled={isLoading}>
        {#if isLoading}
          <span class="spinner"></span>
          Logging in...
        {:else}
          Log In
        {/if}
      </button>
    </form>

    <div class="mock-hint">
      <p><strong>Mock Accounts:</strong></p>
      <p>Student: student@srmist.edu.in / student123</p>
      <p>Faculty: fa@srmist.edu.in / faculty123</p>
      <p>Advisor: aa@srmist.edu.in / advisor123</p>
    </div>
  </div>
</main>

<style>
  .login-container {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 2.5rem 2rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .logo-image {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    margin-bottom: 1rem;
  }

  .logo {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-white);
    letter-spacing: -1px;
    margin-bottom: 0.25rem;
  }

  .tagline {
    font-size: 1rem;
    color: var(--color-muted);
    font-weight: 400;
  }

  .byline {
    display: block;
    font-size: 0.85rem;
    color: var(--color-accent);
    font-weight: 500;
    margin-top: 0.25rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group label {
    font-size: 0.875rem;
    color: var(--color-muted);
    font-weight: 500;
  }

  .input-group input {
    padding: 0.875rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-white);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .input-group input::placeholder {
    color: rgba(191, 192, 192, 0.5);
  }

  .input-group input:focus {
    outline: none;
    border-color: var(--color-accent);
    background: rgba(255, 255, 255, 0.08);
  }

  .password-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-wrapper input {
    width: 100%;
    padding-right: 3rem;
  }

  .password-toggle {
    position: absolute;
    right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: none;
    background: transparent;
    color: var(--color-muted);
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .password-toggle:hover {
    color: var(--color-accent);
  }

  .login-btn {
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

  .login-btn:hover:not(:disabled) {
    background: #e5723f;
    transform: translateY(-1px);
  }

  .login-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-btn:disabled {
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

  .error-message {
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #fca5a5;
    font-size: 0.875rem;
    text-align: center;
  }

  .mock-hint {
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    text-align: center;
    font-size: 0.75rem;
    color: rgba(191, 192, 192, 0.5);
    line-height: 1.6;
  }

  .mock-hint strong {
    color: rgba(191, 192, 192, 0.7);
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 2rem 1.5rem;
    }

    .logo-image {
      width: 70px;
      height: 70px;
    }

    .logo {
      font-size: 2rem;
    }
  }

  @supports (padding: env(safe-area-inset-bottom)) {
    .login-container {
      padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
    }
  }
</style>
