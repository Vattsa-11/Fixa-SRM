<script lang="ts">
  import { requests } from '$lib/stores';
  import type { Request } from '$lib/stores';
  import { Check, X, CaretDown } from 'phosphor-svelte';

  interface Props {
    request: Request;
  }

  const { request }: Props = $props();
  let isExpanded = $state(false);

  function getDayOfWeek(dateStr: string): string {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function handleAccept(e: Event) {
    e.stopPropagation();
    requests.update(reqs =>
      reqs.map(r =>
        r.id === request.id ? { ...r, status: 'accepted' as const } : r
      )
    );
  }

  function handleReject(e: Event) {
    e.stopPropagation();
    requests.update(reqs =>
      reqs.map(r =>
        r.id === request.id ? { ...r, status: 'rejected' as const } : r
      )
    );
  }

  function toggleExpand() {
    isExpanded = !isExpanded;
  }
</script>

<div class="request-card">
  <button class="request-row" onclick={toggleExpand}>
    <div class="request-info">
      <div class="request-subject">{request.subject}</div>
      <div class="request-meta">
        <span class="date-badge">{formatDate(request.date)} ({getDayOfWeek(request.date)})</span>
        <span class="separator">•</span>
        <span class="time-slot">{request.timeSlot}</span>
        <span class="separator">•</span>
        <span class="day-order">{request.dayOrder}</span>
        <span class="separator">•</span>
        <span class="requester">{request.requesterName}</span>
      </div>
    </div>

    <div class="actions-right">
      {#if request.status === 'pending'}
        <div class="action-buttons" onclick={(e) => e.stopPropagation()}>
          <button class="btn btn-accept" onclick={handleAccept} title="Accept">
            <Check size={18} weight="bold" />
          </button>
          <button class="btn btn-reject" onclick={handleReject} title="Reject">
            <X size={18} weight="bold" />
          </button>
        </div>
      {:else if request.status === 'accepted'}
        <div class="status-badge accepted">Accepted</div>
      {:else if request.status === 'rejected'}
        <div class="status-badge rejected">Rejected</div>
      {/if}
      <div class="expand-icon" class:expanded={isExpanded}>
        <CaretDown size={18} />
      </div>
    </div>
  </button>

  {#if isExpanded}
    <div class="request-expanded">
      <div class="reason-section">
        <h4>Full Reason</h4>
        <p>{request.reason}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .request-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .request-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .request-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: all 0.2s ease;
  }

  .request-row:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .request-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .request-subject {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-white);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .request-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--color-muted);
    flex-wrap: wrap;
  }

  .date-badge {
    font-weight: 500;
    color: var(--color-accent);
  }

  .time-slot {
    font-weight: 500;
    color: #a78bfa;
  }

  .separator {
    opacity: 0.5;
  }

  .day-order {
    font-weight: 500;
  }

  .actions-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-left: 1.5rem;
    flex-shrink: 0;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .btn-accept {
    color: #86efac;
  }

  .btn-accept:hover {
    background: rgba(134, 239, 172, 0.15);
    color: #86efac;
  }

  .btn-reject {
    color: #fca5a5;
  }

  .btn-reject:hover {
    background: rgba(252, 165, 165, 0.15);
    color: #fca5a5;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .status-badge.accepted {
    background: rgba(134, 239, 172, 0.15);
    color: #86efac;
  }

  .status-badge.rejected {
    background: rgba(252, 165, 165, 0.15);
    color: #fca5a5;
  }

  .expand-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-muted);
    transition: transform 0.3s ease;
  }

  .expand-icon.expanded {
    transform: rotate(180deg);
  }

  .request-expanded {
    padding: 0 1.25rem 1rem 1.25rem;
    background: rgba(255, 255, 255, 0.02);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    animation: slideDown 0.3s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      height: 0;
    }
    to {
      opacity: 1;
      height: auto;
    }
  }

  .reason-section {
    padding-top: 1rem;
  }

  .reason-section h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-white);
    margin-bottom: 0.75rem;
  }

  .reason-section p {
    font-size: 0.875rem;
    color: var(--color-muted);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .request-row {
      padding: 0.875rem 1rem;
    }

    .request-subject {
      font-size: 0.9rem;
    }

    .request-meta {
      font-size: 0.75rem;
    }

    .actions-right {
      gap: 0.5rem;
      margin-left: 1rem;
    }

    .btn {
      width: 36px;
      height: 36px;
    }
  }

  @media (max-width: 480px) {
    .request-row {
      flex-wrap: wrap;
      padding: 0.75rem;
      gap: 0.5rem;
    }

    .request-info {
      width: 100%;
      flex: 1;
    }

    .request-subject {
      font-size: 0.85rem;
    }

    .request-meta {
      font-size: 0.7rem;
      gap: 0.3rem;
    }

    .actions-right {
      width: 100%;
      margin-left: 0;
      margin-top: 0;
      justify-content: flex-start;
      gap: 0.4rem;
    }

    .btn {
      width: 32px;
      height: 32px;
    }

    .expand-icon {
      margin-left: auto;
    }

    .request-expanded {
      padding: 0 0.75rem 0.75rem 0.75rem;
    }

    .reason-section {
      padding-top: 0.75rem;
    }

    .reason-section h4 {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
    }

    .reason-section p {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 360px) {
    .request-row {
      padding: 0.6rem;
      gap: 0.4rem;
    }

    .request-subject {
      font-size: 0.8rem;
    }

    .request-meta {
      font-size: 0.65rem;
      gap: 0.25rem;
    }

    .date-badge,
    .time-slot,
    .day-order,
    .requester {
      white-space: nowrap;
    }

    .separator {
      opacity: 0.3;
    }

    .btn {
      width: 30px;
      height: 30px;
    }

    .status-badge {
      padding: 0.35rem 0.7rem;
      font-size: 0.7rem;
    }

    .expand-icon {
      width: 20px;
      height: 20px;
    }

    .request-expanded {
      padding: 0 0.6rem 0.6rem 0.6rem;
    }

    .reason-section h4 {
      font-size: 0.75rem;
      margin-bottom: 0.4rem;
    }

    .reason-section p {
      font-size: 0.75rem;
      line-height: 1.4;
    }
  }
</style>
