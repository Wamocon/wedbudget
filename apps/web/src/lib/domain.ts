import type {
  ChecklistItem,
  Expense,
  ExpenseAttachment,
  ExpenseStatus,
  ExpenseUpdate,
  PlanningData,
} from './types';

export const DATA_VERSION = 2;

export const REGIONAL_MULTIPLIER: Record<string, number> = {
  'Baden-Württemberg': 1.15,
  Bayern: 1.2,
  Berlin: 1.1,
  Brandenburg: 0.9,
  Bremen: 1.05,
  Hamburg: 1.25,
  Hessen: 1.15,
  'Mecklenburg-Vorpommern': 0.85,
  Niedersachsen: 1.0,
  'Nordrhein-Westfalen': 1.1,
  'Rheinland-Pfalz': 1.05,
  Saarland: 0.95,
  Sachsen: 0.85,
  'Sachsen-Anhalt': 0.85,
  'Schleswig-Holstein': 1.05,
  Thüringen: 0.85,
  International: 1.5,
};

export const EXPENSE_CATEGORIES: string[] = [
  'Location',
  'Catering',
  'Einladungen',
  'Kleidung',
  'Fotografie',
  'Dekoration',
  'Ringe',
  'Musik & Entertainment',
  'Styling',
  'Transport',
  'Gastgeschenke',
  'Flitterwochen',
  'Trauzeugen',
  'Sonstiges',
];

export function getDefaultData(): PlanningData {
  return {
    version: DATA_VERSION,
    weddingName: 'Unsere Hochzeit',
    weddingDate: '',
    guestCount: 80,
    region: 'Nordrhein-Westfalen',
    totalBudget: 25000,
    expenses: [],
  };
}

export function applyHeuristics(
  expenses: Expense[],
  guestCount: number,
  region: string,
): Expense[] {
  void region;
  return expenses.map((exp) => {
    if (exp.isPerPerson) {
      return { ...exp, estimated: Math.round(exp.costPerPerson * guestCount) };
    }
    if (exp.category === 'Location' && exp.item === 'Miete & Reinigung') {
      return { ...exp, estimated: Math.round(1500 + guestCount * 15) };
    }
    return exp;
  });
}

function toStatus(value: unknown, paidValue: unknown): ExpenseStatus {
  if (value === 'open' || value === 'in_progress' || value === 'paid' || value === 'done') {
    return value;
  }
  if (paidValue === true) return 'paid';
  return 'open';
}

function sanitizeUpdates(value: unknown): ExpenseUpdate[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, idx) => {
      const obj = entry as Record<string, unknown>;
      const message = typeof obj.message === 'string' ? obj.message : '';
      const createdAt = typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString();
      return {
        id: typeof obj.id === 'string' ? obj.id : `u-${idx}-${Date.now()}`,
        message,
        createdAt,
      };
    })
    .filter((entry) => entry.message.trim().length > 0);
}

function sanitizeAttachments(value: unknown): ExpenseAttachment[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, idx) => {
      const obj = entry as Record<string, unknown>;
      return {
        id: typeof obj.id === 'string' ? obj.id : `a-${idx}-${Date.now()}`,
        name: typeof obj.name === 'string' ? obj.name : `Anhang-${idx + 1}`,
        dataUrl: typeof obj.dataUrl === 'string' ? obj.dataUrl : '',
        createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString(),
      };
    })
    .filter((entry) => entry.dataUrl.length > 0);
}

function sanitizeChecklist(value: unknown): ChecklistItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, idx) => {
      const obj = entry as Record<string, unknown>;
      const title = typeof obj.title === 'string' ? obj.title.trim() : '';
      return {
        id: typeof obj.id === 'string' ? obj.id : `c-${idx}-${Date.now()}`,
        title,
        done: obj.done === true,
        targetDate: typeof obj.targetDate === 'string' ? obj.targetDate : '',
        createdAt: typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString(),
      };
    })
    .filter((entry) => entry.title.length > 0);
}

function normalizeCategory(value: string): string {
  if (value === 'Papeterie' || value === 'Stationery') return 'Einladungen';
  return value;
}

export function migrateData(data: unknown): PlanningData {
  if (!data || typeof data !== 'object') return getDefaultData();
  const obj = data as Record<string, unknown>;
  const fallback = getDefaultData();

  const rawExpenses = Array.isArray(obj.expenses) ? obj.expenses : fallback.expenses;

  const expenses: Expense[] = rawExpenses.map((entry, idx) => {
    const raw = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>;
    const legacyComment = typeof raw.comment === 'string' ? raw.comment.trim() : '';
    const updates = sanitizeUpdates(raw.updates);
    const checklist = sanitizeChecklist(raw.checklist);

    if (legacyComment.length > 0 && updates.length === 0) {
      updates.push({
        id: `legacy-${idx}`,
        message: legacyComment,
        createdAt: new Date().toISOString(),
      });
    }

    return {
      id: typeof raw.id === 'string' ? raw.id : `exp-${idx + 1}`,
      category:
        typeof raw.category === 'string' ? normalizeCategory(raw.category) : 'Sonstiges',
      item: typeof raw.item === 'string' ? raw.item : 'Neu',
      targetDate: typeof raw.targetDate === 'string' ? raw.targetDate : '',
      estimated: typeof raw.estimated === 'number' ? raw.estimated : 0,
      actual: typeof raw.actual === 'number' ? raw.actual : 0,
      status: toStatus(raw.status, raw.paid),
      isPerPerson: raw.isPerPerson === true,
      costPerPerson: typeof raw.costPerPerson === 'number' ? raw.costPerPerson : 0,
      attachments: sanitizeAttachments(raw.attachments),
      updates,
      checklist,
    };
  });

  return {
    version: DATA_VERSION,
    weddingName: typeof obj.weddingName === 'string' ? obj.weddingName : fallback.weddingName,
    weddingDate: typeof obj.weddingDate === 'string' ? obj.weddingDate : fallback.weddingDate,
    guestCount: typeof obj.guestCount === 'number' ? obj.guestCount : fallback.guestCount,
    region: typeof obj.region === 'string' ? obj.region : fallback.region,
    totalBudget: typeof obj.totalBudget === 'number' ? obj.totalBudget : fallback.totalBudget,
    expenses,
  };
}
