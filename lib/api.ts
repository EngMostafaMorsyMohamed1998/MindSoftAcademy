export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  const body = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: T;
    error?: string;
  } | null;

  if (!response.ok || !body?.success || body.data === undefined) {
    throw new Error(body?.error ?? `Request failed (${response.status})`);
  }

  return body.data;
}
