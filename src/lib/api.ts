// 심플 fetch 래퍼
export async function api<T>(
  input: RequestInfo,
  init?: RequestInit & { parse?: (data: any) => T }
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store', // 최신성 필요시
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return init?.parse ? init.parse(json) : json;
}
