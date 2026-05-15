const BASE_URL: string = import.meta.env.VITE_API_URL;

export interface ApiError {
  status?: number;
  message: string;
  errorCode?: string;
  fieldErrors?: Record<string, string>;
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const options: RequestInit = {
    method,
    credentials: "include",
    headers: { "content-type": "application/json" },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(path, options);

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const retry = await fetch(path, options);
      if (!retry.ok) throw await toError(retry);
      return (retry.status === 204 ? null : retry.json()) as T;
    }
    throw { status: 401, message: "Unauthorized" };
  }

  if (!res.ok) throw await toError(res);
  return (res.status === 204 ? null : res.json()) as T;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function toError(res: Response): Promise<ApiError> {
  try {
    const body = await res.json();
    return {
      status: res.status,
      // || : null and "" are falsy
      message: body.message || "Request failed",
      errorCode: body.errorCode,
      fieldErrors: body.fieldErrors,
    };
  } catch {
    // throw when res isn't valid json
    return { status: res.status, message: "Request failed" };
  }
}

export const api = {
  get: <T = unknown,>(path: string) => request<T>("GET", path),
  post: <T = unknown,>(path: string, body?: unknown) =>
    request<T>("POST", path, body),
  put: <T = unknown,>(path: string, body?: unknown) =>
    request<T>("PUT", path, body),
  delete: (path: string) => request("DELETE", path),
};

// ── Auth endpoints ──────────────────────────────────────────────────────────
export interface AuthResponse {
  username: string;
  role: string;
  message: string;
}

export interface MeResponse {
  username: string;
  role: string;
}

export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<AuthResponse>(`${BASE_URL}/api/v1/auth/login`, data),
  register: (data: { username: string; password: string; role?: string }) =>
    api.post<AuthResponse>(`${BASE_URL}/api/v1/auth/register`, data),
  logout: () => api.post<void>(`${BASE_URL}/api/v1/auth/logout`),
  me: () => api.get<MeResponse>(`${BASE_URL}/api/v1/auth/me`),
};

// ── Hardship endpoints ───────────────────────────────────────────────────────
// Form state type — income/expenses are strings to preserve input precision
export interface HardshipFormInput {
  name: string;
  dateOfBirth: string;
  income: string;
  expenses: string;
  reason: string;
}

// API request type — income/expenses are numbers (parsed and rounded before sending)
export interface CreateHardshipRequest {
  name: string;
  dateOfBirth: string; // convert to local Date automatically "YYYY-MM-DD"
  income: number; // float will lose precision on number
  expenses: number;
  reason: string | null;
}

export interface UpdateItem {
  hardshipId: number;
  name: string;
  dateOfBirth: string; // convert to local Date automatically "YYYY-MM-DD"
  income: number; // float will lose precision on number
  expenses: number;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface UpdateHardshipRequest {
  name: string;
  dateOfBirth: string; // convert to local Date automatically "YYYY-MM-DD"
  income: number; // float will lose precision on number
  expenses: number;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface Application {
  hardshipId: number;
  name: string;
  dateOfBirth: string;
  income: number;
  expenses: number;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export const hardshipApi = {
  getAll: () => api.get<Application[]>(`${BASE_URL}/api/v1/hardship`),
  create: (data: CreateHardshipRequest) =>
    api.post<Application>(`${BASE_URL}/api/v1/hardship`, data),
  update: (id: number, data: UpdateHardshipRequest) =>
    api.put<Application>(`${BASE_URL}/api/v1/hardship/${id}`, data),
  delete: (id: number) => api.delete(`${BASE_URL}/api/v1/hardship/${id}`),
};
