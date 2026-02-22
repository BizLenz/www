const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  files: {
    search: `${API_BASE_URL}/files/search`,
    upload: `${API_BASE_URL}/files/upload`,
    uploadMetadata: `${API_BASE_URL}/files/upload/metadata`,
    delete: (id: number) => `${API_BASE_URL}/files/${id}`,
  },
  evaluation: {
    request: `${API_BASE_URL}/evaluation/request`,
    results: (id: number | string) =>
      `${API_BASE_URL}/evaluation/results/${id}`,
    financial: (id: string) =>
      `${API_BASE_URL}/evaluation/results/financial/${id}`,
    market: (id: string) => `${API_BASE_URL}/evaluation/results/market/${id}`,
    risk: (id: string) => `${API_BASE_URL}/evaluation/results/risk/${id}`,
    technical: (id: string) =>
      `${API_BASE_URL}/evaluation/results/technical/${id}`,
  },
} as const;
