// Small helper utilities to extract data lists from API responses
export function extractListFromResponse(resp: any, key?: string): any[] {
  if (!resp) return [];
  // The backend sometimes uses wrapper { success, data } or just returns an array
  const payload = resp?.data ?? resp;

  // If a key is provided, prefer that
  if (key && payload?.[key]) {
    if (Array.isArray(payload[key])) return payload[key];
    if (payload[key] && typeof payload[key] === "object" && Array.isArray(payload[key].items)) return payload[key].items;
  }

  if (Array.isArray(payload)) return payload;

  // Common shapes: { complaints: [] }, { items: [] }, { data: [] }, nested structures
  if (Array.isArray(payload?.complaints)) return payload.complaints;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(resp)) return resp;

  // Trying nested wrapper: resp.data?.data or resp.data?.complaints
  const nested = resp?.data?.data ?? resp?.data;
  if (Array.isArray(nested)) return nested;
  if (Array.isArray(resp?.data?.complaints)) return resp.data.complaints;

  return [];
}

export default extractListFromResponse;
