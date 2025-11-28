import { showToast } from '../toast';
import { expect, it, describe, beforeEach, afterEach } from 'vitest';

describe('showToast', () => {
  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    const container = document.getElementById('toast-container');
    if (container) container.remove();
  });

  it('creates a toast container and an alert role for error type', () => {
    showToast('This is an error', 'error', 5000);
    const container = document.getElementById('toast-container');
    expect(container).not.toBeNull();
    const alert = container?.querySelector('[role="alert"]');
    expect(alert).not.toBeNull();
  });

  it('creates a status role for info type', () => {
    showToast('This is info', 'info', 5000);
    const container = document.getElementById('toast-container');
    const status = container?.querySelector('[role="status"]');
    expect(status).not.toBeNull();
  });
});
