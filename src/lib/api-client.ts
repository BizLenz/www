export interface ApiError {
  detail: string;
  status_code: number;
}

// Client-side: returns { data, error } without throwing
export async function authenticatedFetch<T>(
  url: string,
  token: string | undefined,
  options?: RequestInit,
): Promise<{ data: T | null; error: ApiError | null }> {
  if (!token) {
    return {
      data: null,
      error: { detail: "Not authenticated.", status_code: 401 },
    };
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({}))) as Partial<ApiError>;
      return {
        data: null,
        error: {
          detail: errorData.detail ?? `HTTP error! status: ${response.status}`,
          status_code: response.status,
        },
      };
    }

    return { data: (await response.json()) as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: {
        detail:
          err instanceof Error ? err.message : "An unknown error occurred",
        status_code: 500,
      },
    };
  }
}

// Server-side: throws on error
export async function serverFetch<T>(
  url: string,
  token: string | undefined,
  options?: RequestInit,
): Promise<T> {
  if (!token) throw new Error("Session not found");

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (!response.ok)
    throw new Error(`Request failed with status ${response.status}`);
  return (await response.json()) as T;
}
