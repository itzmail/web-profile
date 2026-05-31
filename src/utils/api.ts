const BASE_URL = import.meta.env.API_BASE_URL ?? "http://my-data.itsmail.dev/api";

export async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
