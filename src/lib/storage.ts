import type { PlanningData } from './types';
import { DATA_VERSION, migrateData } from './domain';

const LOCAL_KEY = 'wedbudget_data';

export function saveToLocal(data: Omit<PlanningData, 'version'>): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...data, version: DATA_VERSION }));
  } catch {
    // silent – storage may be unavailable
  }
}

export function loadFromLocal(): PlanningData | null {
  try {
    const item = localStorage.getItem(LOCAL_KEY);
    if (!item) return null;
    return migrateData(JSON.parse(item) as unknown);
  } catch {
    return null;
  }
}

export function clearLocalData(): void {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    // silent
  }
}

export async function exportToJson(data: Omit<PlanningData, 'version'>): Promise<void> {
  const payload = JSON.stringify({ ...data, version: DATA_VERSION }, null, 2);
  const filename = `wedbudget-planung-${new Date().toISOString().split('T')[0]}.json`;

  // Prefer native save dialog when available to let users choose a location.
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await (window as Window & {
        showSaveFilePicker: (options?: {
          suggestedName?: string;
          types?: Array<{ description?: string; accept: Record<string, string[]> }>;
          excludeAcceptAllOption?: boolean;
        }) => Promise<{ createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }> }>;
      }).showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'JSON',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(payload);
      await writable.close();
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      // Fall back to classic download when picker is unavailable/blocked.
    }
  }

  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportedJson(jsonString: string): PlanningData {
  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;
    if (!data.expenses) throw new Error('Invalid structure');
    return migrateData(data);
  } catch {
    throw new Error('Ungültige oder beschädigte Datei.');
  }
}

const utf8ToB64 = (str: string): string =>
  window.btoa(
    encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      (_match: string, p1: string) => String.fromCharCode(parseInt(p1, 16)),
    ),
  );

const b64ToUtf8 = (str: string): string =>
  decodeURIComponent(
    Array.from(window.atob(str))
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );

export function loadFromUrl(): PlanningData | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (!dataParam) return null;
    return migrateData(JSON.parse(b64ToUtf8(dataParam)) as unknown);
  } catch {
    return null;
  }
}

export function generateShareUrl(data: Omit<PlanningData, 'version'>): string {
  try {
    const payload = JSON.stringify({ ...data, version: DATA_VERSION });
    const b64 = utf8ToB64(payload);
    const url = new URL(window.location.href);
    url.searchParams.set('data', b64);
    return url.toString();
  } catch {
    return window.location.href;
  }
}
