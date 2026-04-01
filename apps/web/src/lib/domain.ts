import type { Expense, PlanningData } from './types';

export const DATA_VERSION = 1;

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
  'Papeterie',
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

const DEFAULT_EXPENSES: Expense[] = [
  { id: '1', category: 'Location', item: 'Miete & Reinigung', estimated: 1800, actual: 0, paid: false, comment: '', isPerPerson: false, costPerPerson: 0 },
  { id: '2', category: 'Catering', item: 'Speisen & Getränke', estimated: 0, actual: 0, paid: false, comment: 'Inklusive Mitternachtssnack', isPerPerson: true, costPerPerson: 130 },
  { id: '3', category: 'Papeterie', item: 'Einladungen & Danksagungen', estimated: 0, actual: 0, paid: false, comment: 'Porto nicht vergessen', isPerPerson: true, costPerPerson: 6 },
  { id: '4', category: 'Kleidung', item: 'Brautkleid & Anzug', estimated: 2500, actual: 0, paid: false, comment: 'Änderungsschneiderei separat einplanen', isPerPerson: false, costPerPerson: 0 },
  { id: '5', category: 'Fotografie', item: 'Fotograf (ganztags)', estimated: 2000, actual: 0, paid: false, comment: '10 Stunden Begleitung', isPerPerson: false, costPerPerson: 0 },
  { id: '6', category: 'Dekoration', item: 'Blumen & Tischdeko', estimated: 1200, actual: 0, paid: false, comment: '', isPerPerson: false, costPerPerson: 0 },
  { id: '7', category: 'Ringe', item: 'Eheringe', estimated: 1500, actual: 0, paid: false, comment: 'Inkl. Gravur', isPerPerson: false, costPerPerson: 0 },
];

export function getDefaultData(): PlanningData {
  return {
    version: DATA_VERSION,
    guestCount: 80,
    region: 'Nordrhein-Westfalen',
    totalBudget: 25000,
    expenses: JSON.parse(JSON.stringify(DEFAULT_EXPENSES)) as Expense[],
  };
}

export function applyHeuristics(
  expenses: Expense[],
  guestCount: number,
  region: string,
): Expense[] {
  const multi = REGIONAL_MULTIPLIER[region] ?? 1.0;
  return expenses.map((exp) => {
    if (exp.isPerPerson) {
      return { ...exp, estimated: Math.round(exp.costPerPerson * guestCount * multi) };
    }
    if (exp.category === 'Location' && exp.item === 'Miete & Reinigung') {
      return { ...exp, estimated: Math.round((1500 + guestCount * 15) * multi) };
    }
    return exp;
  });
}

export function migrateData(data: unknown): PlanningData {
  if (!data || typeof data !== 'object') return getDefaultData();
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.expenses)) {
    obj.expenses = getDefaultData().expenses;
  }
  obj.version = DATA_VERSION;
  return obj as unknown as PlanningData;
}
