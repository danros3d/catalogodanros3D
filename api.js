import { config } from './config.js';
export const configured = Boolean(config.supabaseUrl && config.supabaseKey);
export async function request(path, options = {}, token) {
  if (!configured) throw new Error('Configura Supabase en config.js primero.');
  const headers = { apikey: config.supabaseKey, ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof Blob)) headers['Content-Type'] = 'application/json';
  const response = await fetch(config.supabaseUrl.replace(/\/$/, '') + path, { ...options, headers });
  if (!response.ok) { let detail = {}; try { detail = await response.json(); } catch {} throw new Error(detail.message || detail.msg || detail.error_description || `Solicitud fallida (${response.status}).`); }
  return response.status === 204 ? null : response.json();
}
export const money = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
export function element(tag, text, className) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; }
