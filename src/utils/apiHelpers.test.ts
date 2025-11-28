import { describe, it, expect } from 'vitest';
import extractListFromResponse from './apiHelpers';

describe('extractListFromResponse', () => {
  it('returns array when resp.data is an array', () => {
    const resp = { data: [1, 2, 3] };
    expect(extractListFromResponse(resp)).toEqual([1, 2, 3]);
  });

  it('returns array when resp is an array', () => {
    const resp = [4, 5, 6];
    expect(extractListFromResponse(resp)).toEqual([4, 5, 6]);
  });

  it('returns payload[key] when a key param is provided', () => {
    const resp = { data: { complaints: [{ id: 1 }, { id: 2 }] } };
    expect(extractListFromResponse(resp, 'complaints')).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('returns nested resp.data.data arrays', () => {
    const resp = { data: { data: [{ id: 'a' }, { id: 'b' }] } };
    expect(extractListFromResponse(resp)).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('returns [] when no array is found', () => {
    const resp = { data: { meta: { total: 0 } } };
    expect(extractListFromResponse(resp)).toEqual([]);
  });

  it('picks items arrays inside keyed payloads (object with items array)', () => {
    const resp = { data: { services: { items: [{ id: 1 }] } } };
    expect(extractListFromResponse(resp, 'services')).toEqual([{ id: 1 }]);
  });
});
