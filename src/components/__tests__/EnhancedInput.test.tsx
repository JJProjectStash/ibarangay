import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import EnhancedInput from '../EnhancedInput';

describe('EnhancedInput accessibility', () => {
  it('adds generated id and associates label with input when no id provided', () => {
    render(<EnhancedInput label="Name" />);
    const label = screen.getByText('Name');
    const input = label.closest('label') ? document.getElementById((label.closest('label') as HTMLLabelElement).getAttribute('for') || '') : null;
    expect(label).toBeDefined();
    // the input should exist and be associated
    expect(input).not.toBeNull();
  });

  it('sets aria-describedby for helper text and error text', () => {
    render(<EnhancedInput id="test-id" label="Email" helperText="helper" error="Oops" />);
    const input = screen.getByLabelText('Email');
    // both helper and error elements should be in the DOM
    const helper = document.getElementById('test-id-helper');
    const err = document.getElementById('test-id-error');
    expect(helper).not.toBeNull();
    expect(err).not.toBeNull();
    expect(input.getAttribute('aria-describedby')).toContain('test-id-helper');
    expect(input.getAttribute('aria-describedby')).toContain('test-id-error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('ensures icon is decorative and aria-hidden', () => {
    render(<EnhancedInput id="with-icon" label="Test" icon={<span data-testid="icon">★</span>} />);
    const icon = screen.getByTestId('icon');
    expect(icon.closest('span')?.getAttribute('aria-hidden')).toBe('true');
  });
});
