export interface Expense {
  id: string;
  category: string;
  item: string;
  estimated: number;
  actual: number;
  paid: boolean;
  comment: string;
  isPerPerson: boolean;
  costPerPerson: number;
}

export interface PlanningData {
  version: number;
  guestCount: number;
  region: string;
  totalBudget: number;
  expenses: Expense[];
}
