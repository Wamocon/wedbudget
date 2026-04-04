export type ExpenseStatus = 'open' | 'in_progress' | 'paid' | 'done';

export interface ExpenseAttachment {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: string;
}

export interface ExpenseUpdate {
  id: string;
  message: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
  targetDate: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: string;
  item: string;
  targetDate: string;
  estimated: number;
  actual: number;
  status: ExpenseStatus;
  isPerPerson: boolean;
  costPerPerson: number;
  attachments: ExpenseAttachment[];
  updates: ExpenseUpdate[];
  checklist: ChecklistItem[];
}

export interface PlanningData {
  version: number;
  weddingName: string;
  weddingDate: string;
  guestCount: number;
  totalBudget: number;
  expenses: Expense[];
}
