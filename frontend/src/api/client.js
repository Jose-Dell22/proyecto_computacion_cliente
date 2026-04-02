/**
 * Base URL del backend. Vacío en desarrollo = rutas relativas `/api` (proxy de Vite → :4000).
 * En producción: VITE_API_URL=https://tu-servidor.com
 */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  if (base) return `${base}${p}`;
  return p;
}

export async function apiFetch(path, options = {}) {
  const { headers = {}, ...rest } = options;
  const isFormData = rest.body instanceof FormData;
  return fetch(apiUrl(path), {
    ...rest,
    credentials: "include",
    headers: isFormData
      ? { ...headers }
      : { "Content-Type": "application/json", ...headers },
  });
}
