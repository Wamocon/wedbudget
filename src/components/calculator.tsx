'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  Info,
  Plus,
  MessageCircle,
  Wallet,
  PieChart,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Users,
  CalendarDays,
  Share2,
  Printer,
  Trash2,
  Sun,
  Moon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import DateSelectField, { parseIsoDateParts } from '@/components/date-select-field';
import { saveToLocal, exportToJson, generateShareUrl } from '@/lib/storage';
import { EXPENSE_CATEGORIES } from '@/lib/domain';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import type { ChecklistItem, Expense, ExpenseStatus, PlanningData } from '@/lib/types';

interface CalculatorProps {
  initialData: PlanningData;
  onBack: () => void;
  initialTab?: 'basics' | 'dashboard';
}

type AppTab = 'basics' | 'dashboard' | 'details';
type MetricBarEntry = {
  name: string;
  value: number;
};

const MAX_WEDDING_NAME_LENGTH = 50;
const MAX_GUEST_COUNT = 999;
const MAX_MONEY_AMOUNT = 9999999;
const MAX_COMMENT_LENGTH = 250;
const MAX_CHECKLIST_ITEM_LENGTH = 100;
const MAX_EXPENSE_ITEM_LENGTH = 120;
const CURRENT_YEAR = new Date().getFullYear();
const MIN_WEDDING_YEAR = CURRENT_YEAR - 1;
const MAX_WEDDING_YEAR = CURRENT_YEAR + 10;

const clampInt = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
};

const clampMoney = (value: number, min: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(MAX_MONEY_AMOUNT, Math.max(min, Math.round(value)));
};

const formatSignedEuro = (value: number) => (value > 0 ? `+${formatEuro(value)}` : formatEuro(value));

const formatEuro = (val: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);

const statusOrder: ExpenseStatus[] = ['open', 'in_progress', 'paid', 'done'];
const CLOSED_STATUSES = new Set<ExpenseStatus>(['paid', 'done']);

export default function Calculator({ initialData, onBack, initialTab = 'dashboard' }: CalculatorProps) {
  const { lang, switchLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    if (typeof window === 'undefined') return initialTab;
    const params = new URLSearchParams(window.location.search);
    const expenseParam = params.get('expense');
    if (expenseParam) return 'details';
    const tabParam = params.get('tab');
    if (tabParam === 'basics' || tabParam === 'dashboard' || tabParam === 'details') {
      return tabParam;
    }
    return initialTab;
  });
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('expense');
  });
  const [weddingName, setWeddingName] = useState(
    (initialData.weddingName || 'Unsere Hochzeit').slice(0, MAX_WEDDING_NAME_LENGTH),
  );
  const [weddingDate, setWeddingDate] = useState(initialData.weddingDate || '');

  const [guestCount, setGuestCount] = useState<number>(
    clampInt(initialData.guestCount, 1, MAX_GUEST_COUNT),
  );
  const [totalBudget, setTotalBudget] = useState<number>(
    clampInt(initialData.totalBudget, 1, MAX_MONEY_AMOUNT),
  );
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses);
  const [filterStatus, setFilterStatus] = useState<ExpenseStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortDateAsc, setSortDateAsc] = useState<boolean | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [checklistDraft, setChecklistDraft] = useState('');
  const [checklistDateDraft, setChecklistDateDraft] = useState('');
  const [showPdfExportDialog, setShowPdfExportDialog] = useState(false);
  const [pendingPdfPrintMode, setPendingPdfPrintMode] = useState<'current' | 'all' | null>(null);
  const [printAllTabs, setPrintAllTabs] = useState(false);
  const printRestoreStateRef = useRef<{ activeTab: AppTab; selectedExpenseId: string | null } | null>(null);
  const [basicsDraft, setBasicsDraft] = useState(() => ({
    weddingName: (initialData.weddingName || 'Unsere Hochzeit').slice(0, MAX_WEDDING_NAME_LENGTH),
    weddingDate: initialData.weddingDate || '',
    guestCount: clampInt(initialData.guestCount, 1, MAX_GUEST_COUNT),
    totalBudget: clampInt(initialData.totalBudget, 1, MAX_MONEY_AMOUNT),
  }));

  useEffect(() => {
    saveToLocal({ weddingName, weddingDate, guestCount, totalBudget, expenses });
  }, [weddingName, weddingDate, guestCount, totalBudget, expenses]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    if (selectedExpenseId) url.searchParams.set('expense', selectedExpenseId);
    else url.searchParams.delete('expense');
    window.history.replaceState({}, document.title, `${url.pathname}?${url.searchParams.toString()}`);
  }, [activeTab, selectedExpenseId]);

  useEffect(() => {
    if (!pendingPdfPrintMode) return;

    if (pendingPdfPrintMode === 'all' && (!printAllTabs || selectedExpenseId !== null)) {
      return;
    }

    if (pendingPdfPrintMode === 'current' && printAllTabs) {
      return;
    }

    let frame1 = 0;
    let frame2 = 0;
    frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => {
        window.print();
      });
    });

    return () => {
      window.cancelAnimationFrame(frame1);
      window.cancelAnimationFrame(frame2);
    };
  }, [pendingPdfPrintMode, printAllTabs, selectedExpenseId]);

  useEffect(() => {
    const handleAfterPrint = () => {
      setPendingPdfPrintMode(null);

      if (!printRestoreStateRef.current) return;

      const restoreState = printRestoreStateRef.current;
      printRestoreStateRef.current = null;
      setPrintAllTabs(false);
      setActiveTab(restoreState.activeTab);
      setSelectedExpenseId(restoreState.selectedExpenseId);
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const applyHeuristics = (
    newGuests: number,
    currentExpenses: Expense[],
  ): Expense[] => {
    return currentExpenses.map((exp) => {
      if (exp.isPerPerson) {
        return { ...exp, estimated: Math.round(exp.costPerPerson * newGuests) };
      }
      if (exp.category === 'Location' && exp.item === 'Miete & Reinigung') {
        return { ...exp, estimated: Math.round(1500 + newGuests * 15) };
      }
      return exp;
    });
  };

  const selectedExpense = useMemo(
    () => expenses.find((exp) => exp.id === selectedExpenseId) ?? null,
    [expenses, selectedExpenseId],
  );
  const weddingDateParts = useMemo(() => parseIsoDateParts(weddingDate), [weddingDate]);
  const formattedWeddingDate = useMemo(() => {
    if (!weddingDateParts) return '';
    return new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(weddingDateParts.year, weddingDateParts.month - 1, weddingDateParts.day));
  }, [lang, weddingDateParts]);
  const weddingCountdownText = useMemo(() => {
    if (!weddingDateParts) return '';

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weddingDay = new Date(weddingDateParts.year, weddingDateParts.month - 1, weddingDateParts.day);
    const diffDays = Math.round((weddingDay.getTime() - todayStart.getTime()) / 86400000);

    if (diffDays === 0) return t.weddingCountdownToday;
    if (diffDays < 0) return t.weddingCountdownPast;
    return t.weddingCountdownDays(diffDays);
  }, [t, weddingDateParts]);

  const statusText: Record<ExpenseStatus, string> =
    lang === 'de'
      ? {
          open: 'Offen',
          in_progress: 'In Arbeit',
          paid: 'Bezahlt',
          done: 'Fertig',
        }
      : {
          open: 'Open',
          in_progress: 'In Progress',
          paid: 'Paid',
          done: 'Done',
        };

  const saveBasicsAndContinue = () => {
    const nextGuests = clampInt(Number(basicsDraft.guestCount), 1, MAX_GUEST_COUNT);
    const nextBudget = clampInt(Number(basicsDraft.totalBudget), 1, MAX_MONEY_AMOUNT);
    const nextName = (basicsDraft.weddingName || '').trim().slice(0, MAX_WEDDING_NAME_LENGTH);

    const shouldRecalc = nextGuests !== guestCount;

    setWeddingName(nextName.length > 0 ? nextName : (lang === 'de' ? 'Unsere Hochzeit' : 'Our Wedding'));
    setWeddingDate(basicsDraft.weddingDate || '');
    setGuestCount(nextGuests);
    setTotalBudget(nextBudget);

    if (shouldRecalc) {
      setExpenses((prev) => applyHeuristics(nextGuests, prev));
    }

    setActiveTab('dashboard');
  };

  const handleExpenseChange = <K extends keyof Expense>(
    id: string,
    field: K,
    value: Expense[K],
  ) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== id) return exp;
        const updated: Expense = { ...exp, [field]: value };
        if (field === 'costPerPerson' && updated.isPerPerson) {
          updated.estimated = clampMoney((updated.costPerPerson as number) * guestCount, 1);
        }
        if (field === 'estimated') {
          updated.estimated = clampMoney(Number(value), 1);
        }
        if (field === 'actual') {
          updated.actual = clampMoney(Number(value), 0);
        }
        if (field === 'item') {
          updated.item = String(value).slice(0, MAX_EXPENSE_ITEM_LENGTH);
        }
        if (field === 'estimated' && updated.isPerPerson) {
          updated.isPerPerson = false;
        }
        return updated;
      }),
    );
  };

  const addExpense = () => {
    const newId = Math.random().toString(36).substring(2, 11);
    setExpenses((prev) => [
      ...prev,
      {
        id: newId,
        category: t.newExpenseCategory,
        item: t.newExpenseItem,
        targetDate: '',
        estimated: 1,
        actual: 0,
        status: 'open',
        isPerPerson: false,
        costPerPerson: 0,
        attachments: [],
        updates: [],
        checklist: [],
      },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleShare = () => {
    const url = generateShareUrl({ weddingName, weddingDate, guestCount, totalBudget, expenses });
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(console.error);
  };

  const handleExport = async () => {
    await exportToJson({ weddingName, weddingDate, guestCount, totalBudget, expenses });
  };

  const handlePdfExport = (mode: 'current' | 'all') => {
    setShowPdfExportDialog(false);

    if (mode === 'all') {
      printRestoreStateRef.current = { activeTab, selectedExpenseId };
      setPrintAllTabs(true);
      setSelectedExpenseId(null);
    } else {
      printRestoreStateRef.current = null;
      setPrintAllTabs(false);
    }

    setPendingPdfPrintMode(mode);
  };

  const togglePerPerson = (expenseId: string, enabled: boolean) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp;

        if (!enabled) {
          return { ...exp, isPerPerson: false };
        }

        const safeGuests = Math.max(guestCount, 1);
        const nextCostPerPerson = exp.costPerPerson > 0
          ? exp.costPerPerson
          : Math.max(1, Math.round(exp.estimated / safeGuests));

        return {
          ...exp,
          isPerPerson: true,
          costPerPerson: nextCostPerPerson,
          estimated: clampMoney(nextCostPerPerson * safeGuests, 1),
        };
      }),
    );
  };

  const ui =
    lang === 'de'
      ? {
          tabBasics: 'Eckdaten',
          tabDashboard: 'Dashboard',
          tabDetails: 'Details',
          basicsTitle: 'Eckdaten der Hochzeit',
          weddingName: 'Hochzeitsname',
          weddingDate: 'Hochzeitsdatum',
          continueDashboard: 'Änderungen übernehmen',
          fixedAmount: 'Fixbetrag',
          backToDetails: 'Zurück zu Details',
          editItem: 'Posten bearbeiten',
          category: 'Kategorie',
          targetDateItem: 'Zieldatum (Posten)',
          checklist: 'Checkliste',
          add: 'Hinzufügen',
          deleteSubtask: 'Unterpunkt löschen',
          comments: 'Historie und Kommentare',
          send: 'Senden',
          deleteComment: 'Kommentar löschen',
          noHistory: 'Noch keine Historie vorhanden.',
          pdfTitle: 'PDF-Export',
          pdfText: 'Bitte wählen: nur aktueller Reiter oder alle drei Reiter untereinander.',
          cancel: 'Abbrechen',
          exportCurrent: 'Aktuellen Reiter exportieren',
          exportAll: 'Alle Reiter exportieren',
          datePlaceholder: {
            day: t.datePlaceholderDay,
            month: t.datePlaceholderMonth,
            year: t.datePlaceholderYear,
          },
          toggleThemeTitle: 'Farbmodus wechseln',
        }
      : {
          tabBasics: 'Basics',
          tabDashboard: 'Dashboard',
          tabDetails: 'Details',
          basicsTitle: 'Wedding basics',
          weddingName: 'Wedding name',
          weddingDate: 'Wedding date',
          continueDashboard: 'Continue to dashboard',
          fixedAmount: 'Fixed amount',
          backToDetails: 'Back to details',
          editItem: 'Edit item',
          category: 'Category',
          targetDateItem: 'Target date (item)',
          checklist: 'Checklist',
          add: 'Add',
          deleteSubtask: 'Delete checklist item',
          comments: 'History and comments',
          send: 'Send',
          deleteComment: 'Delete comment',
          noHistory: 'No history yet.',
          pdfTitle: 'PDF export',
          pdfText: 'Choose whether to export only the current tab or all three tabs stacked.',
          cancel: 'Cancel',
          exportCurrent: 'Export current tab',
          exportAll: 'Export all tabs',
          datePlaceholder: {
            day: t.datePlaceholderDay,
            month: t.datePlaceholderMonth,
            year: t.datePlaceholderYear,
          },
          toggleThemeTitle: 'Toggle theme',
        };

  const addCommentToExpense = () => {
    if (!selectedExpense) return;

    const message = commentDraft.trim().slice(0, MAX_COMMENT_LENGTH);
    if (message.length === 0) return;

    const newEntry = {
      id: `u-${Date.now()}`,
      message,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === selectedExpense.id
          ? { ...exp, updates: [...exp.updates, newEntry] }
          : exp,
      ),
    );
    setCommentDraft('');
  };

  const removeUpdateFromExpense = (expenseId: string, updateId: string) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId
          ? { ...exp, updates: exp.updates.filter((entry) => entry.id !== updateId) }
          : exp,
      ),
    );
  };

  const addChecklistItem = () => {
    if (!selectedExpense) return;

    const checklistTitle = checklistDraft.trim().slice(0, MAX_CHECKLIST_ITEM_LENGTH);
    if (checklistTitle.length === 0) return;

    const item: ChecklistItem = {
      id: `c-${Date.now()}`,
      title: checklistTitle,
      done: false,
      targetDate: checklistDateDraft,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === selectedExpense.id
          ? { ...exp, checklist: [...exp.checklist, item] }
          : exp,
      ),
    );
    setChecklistDraft('');
    setChecklistDateDraft('');
  };

  const updateChecklistItem = (
    expenseId: string,
    checklistId: string,
    field: 'done' | 'title' | 'targetDate',
    value: boolean | string,
  ) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== expenseId) return exp;
        const normalizedValue =
          field === 'title' ? String(value).slice(0, MAX_CHECKLIST_ITEM_LENGTH) : value;
        return {
          ...exp,
          checklist: exp.checklist.map((item) =>
            item.id === checklistId
              ? {
                  ...item,
                  [field]: normalizedValue,
                }
              : item,
          ),
        };
      }),
    );
  };

  const removeChecklistItem = (expenseId: string, checklistId: string) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId
          ? { ...exp, checklist: exp.checklist.filter((item) => item.id !== checklistId) }
          : exp,
      ),
    );
  };

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const totalEstimated = expenses.reduce((a, b) => a + Number(b.estimated || 0), 0);
  const totalActualClosed = expenses.reduce(
    (sum, exp) => sum + (CLOSED_STATUSES.has(exp.status) ? Number(exp.actual || 0) : 0),
    0,
  );
  const totalEstimatedClosed = expenses.reduce(
    (sum, exp) => sum + (CLOSED_STATUSES.has(exp.status) ? Number(exp.estimated || 0) : 0),
    0,
  );
  const plannedRemaining = totalEstimated - totalEstimatedClosed;
  const preliminaryResult = totalBudget - (plannedRemaining + totalActualClosed);
  const profitLoss = totalBudget - totalActualClosed;
  const actualOpenAmount = expenses.reduce(
    (sum, exp) => sum + (!CLOSED_STATUSES.has(exp.status) ? Number(exp.actual || 0) : 0),
    0,
  );

  const preliminaryResultTooltip =
    lang === 'de'
      ? `Voraussichtliches Ergebnis\nBudget - (Geplante Restausgaben + Ausgegeben)\n${formatEuro(totalBudget)} - (${formatEuro(plannedRemaining)} + ${formatEuro(totalActualClosed)}) = ${formatSignedEuro(preliminaryResult)}`
      : `Estimated result\nBudget - (Planned remaining + Spent)\n${formatEuro(totalBudget)} - (${formatEuro(plannedRemaining)} + ${formatEuro(totalActualClosed)}) = ${formatSignedEuro(preliminaryResult)}`;

  const totalResultTooltip =
    lang === 'de'
      ? `Gesamtergebnis\nBudget - Ausgegeben\n${formatEuro(totalBudget)} - ${formatEuro(totalActualClosed)} = ${formatSignedEuro(profitLoss)}`
      : `Total result\nBudget - Spent\n${formatEuro(totalBudget)} - ${formatEuro(totalActualClosed)} = ${formatSignedEuro(profitLoss)}`;

  const budgetTooltip =
    lang === 'de'
      ? `Gesamtbudget, das in der Planung verfügbar ist.\nAktuell: ${formatEuro(totalBudget)}`
      : `Total budget available for planning.\nCurrent: ${formatEuro(totalBudget)}`;

  const plannedTooltip =
    lang === 'de'
      ? `Summe aller geplanten Kostenpositionen.\nAktuell: ${formatEuro(totalEstimated)}`
      : `Sum of all planned cost items.\nCurrent: ${formatEuro(totalEstimated)}`;

  const remainingTooltip =
    lang === 'de'
      ? `Geplante Restausgaben\nGeplante Ausgaben gesamt - Geplante Ausgaben in Bezahlt/Fertig\n${formatEuro(totalEstimated)} - ${formatEuro(totalEstimatedClosed)} = ${formatEuro(plannedRemaining)}`
      : `Planned remaining\nTotal planned expenses - Planned expenses in Paid/Done\n${formatEuro(totalEstimated)} - ${formatEuro(totalEstimatedClosed)} = ${formatEuro(plannedRemaining)}`;

  const spentTooltip =
    lang === 'de'
      ? `Ausgegeben enthält nur Posten mit Status Bezahlt oder Fertig.\nAktuell eingerechnet: ${formatEuro(totalActualClosed)}`
      : `Spent only includes items with status Paid or Done.\nCurrently included: ${formatEuro(totalActualClosed)}`;

  const planDiffData: MetricBarEntry[] = [
    { name: t.chartPlanned, value: totalEstimated },
    { name: t.chartSpent, value: totalActualClosed },
    { name: t.chartPlanDiff, value: preliminaryResult },
  ];

  const profitLossData: MetricBarEntry[] = [
    { name: t.chartBudget, value: totalBudget },
    { name: t.chartSpent, value: totalActualClosed },
    { name: t.chartProfitLoss, value: profitLoss },
  ];

  const planned = Math.max(totalEstimated, 0);
  const spent = Math.max(totalActualClosed, 0);
  const sharePieData = planned === 0 && spent === 0
    ? [{ name: t.chartNoData, value: 1, color: 'var(--panel-border)', placeholder: true }]
    : [
        { name: t.chartPlannedShare, value: planned, color: 'var(--accent-gold)', placeholder: false },
        { name: t.chartSpentShare, value: spent, color: 'var(--accent-sage)', placeholder: false },
      ];

  let filteredExpenses = expenses;
  if (filterStatus !== 'all') filteredExpenses = filteredExpenses.filter((e) => e.status === filterStatus);
  if (filterCategory !== 'all') filteredExpenses = filteredExpenses.filter((e) => e.category === filterCategory);
  if (sortDateAsc !== null) {
    filteredExpenses = [...filteredExpenses].sort((a, b) => {
      if (!a.targetDate && !b.targetDate) return 0;
      if (!a.targetDate) return 1;
      if (!b.targetDate) return -1;
      return sortDateAsc
        ? a.targetDate.localeCompare(b.targetDate)
        : b.targetDate.localeCompare(a.targetDate);
    });
  }

  const renderHoverLabel = (text: string, hint: string) => (
    <span className="hover-help" tabIndex={0} aria-label={`${text}: ${hint}`}>
      <span>{text}</span>
      <Info size={13} />
      <span className="hover-help__tooltip">{hint}</span>
    </span>
  );

  const StatsCards = (
    <div className="stats-grid">
      <div className="stats-card">
        <div className="stats-icon">
          <Wallet />
        </div>
        <div className="stats-info">
          <h3>{renderHoverLabel(t.statBudget, budgetTooltip)}</h3>
          <div className="value">{formatEuro(totalBudget)}</div>
        </div>
      </div>
      <div className="stats-card">
        <div className="stats-icon">
          <PieChart />
        </div>
        <div className="stats-info">
          <h3>{renderHoverLabel(t.statPlanned, plannedTooltip)}</h3>
          <div className="value">{formatEuro(totalEstimated)}</div>
        </div>
      </div>
      <div className="stats-card">
        <div className="stats-icon">
          <CalendarDays />
        </div>
        <div className="stats-info">
          <h3>{renderHoverLabel(t.statPlannedRemaining, remainingTooltip)}</h3>
          <div className="value">{formatEuro(plannedRemaining)}</div>
        </div>
      </div>
      <div className="stats-card">
        <div className="stats-icon">
          <CheckCircle />
        </div>
        <div className="stats-info">
          <h3>{renderHoverLabel(t.statSpent, spentTooltip)}</h3>
          <div className="value">{formatEuro(totalActualClosed)}</div>
        </div>
      </div>
      <div className="stats-card">
        <div
          className="stats-icon"
          style={{
            background: preliminaryResult < 0 ? 'rgba(207, 102, 121, 0.1)' : 'rgba(102, 187, 106, 0.1)',
            color: preliminaryResult < 0 ? 'var(--danger)' : 'var(--success)',
          }}
        >
          <TrendingUp />
        </div>
        <div className="stats-info">
          <h3>{renderHoverLabel(t.statPlanDiff, preliminaryResultTooltip)}</h3>
          <div className="value" style={{ color: preliminaryResult < 0 ? 'var(--danger)' : 'var(--success)' }}>
            {formatSignedEuro(preliminaryResult)}
          </div>
        </div>
      </div>
      <div className="stats-card">
        <div
          className="stats-icon"
          style={{
            background: profitLoss < 0 ? 'rgba(207, 102, 121, 0.1)' : 'rgba(102, 187, 106, 0.1)',
            color: profitLoss < 0 ? 'var(--danger)' : 'var(--success)',
          }}
        >
          <Wallet />
        </div>
        <div className="stats-info">
          <h3>{renderHoverLabel(t.statProfitLoss, totalResultTooltip)}</h3>
          <div className="value" style={{ color: profitLoss < 0 ? 'var(--danger)' : 'var(--success)' }}>
            {formatSignedEuro(profitLoss)}
          </div>
        </div>
      </div>
    </div>
  );

  const CalculationHints = (
    <div className="glass-panel" style={{ padding: '1rem' }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
        {t.dashboardHintTitle}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <p>{t.dashboardHintStatusBasis}</p>
        <p>{t.dashboardHintRemainingFormula}</p>
        <p>{t.dashboardHintPlanDiffFormula}</p>
        <p>{t.dashboardHintProfitLossFormula}</p>
      </div>
    </div>
  );

  const selectedCategoryLabel = (category: string) => {
    const idx = EXPENSE_CATEGORIES.indexOf(category);
    if (idx < 0) return category;
    return t.categories[idx] ?? category;
  };

  const showBasicsTab = activeTab === 'basics' || printAllTabs;
  const showDashboardTab = activeTab === 'dashboard' || printAllTabs;
  const showDetailsTableTab = (activeTab === 'details' && !selectedExpense) || printAllTabs;
  const showDetailsExpenseTab = activeTab === 'details' && selectedExpense && !printAllTabs;

  return (
    <div className="app-container fade-in">
      <header className="calc-header fade-in delay-1">
        <div className="calc-header__left hide-print">
          <button onClick={onBack} className="outline" style={{ padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> {t.calcBack}
          </button>
        </div>

        <div className="calc-header__center">
          <h1>{weddingName}</h1>
          <p>{t.calcSubtitle}</p>
          {formattedWeddingDate ? <p style={{ fontSize: '0.9rem' }}>{formattedWeddingDate}</p> : null}
        </div>

        <div className="calc-header__right hide-print">
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => switchLang(e.target.value)}
            aria-label={lang === 'de' ? 'Sprache auswählen' : 'Select language'}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          <button
            onClick={toggleTheme}
            className="theme-switch"
            title={ui.toggleThemeTitle}
            suppressHydrationWarning
          >
            <span className="theme-switch__thumb">
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </span>
          </button>
          <button
            onClick={handleExport}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', minWidth: '80px' }}
            title={t.calcFileTip}
          >
            <Download size={16} /> {t.calcFileBtn}
          </button>
          <button
            onClick={handleShare}
            className="outline"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.9rem',
              minWidth: '80px',
              color: copiedLink ? 'var(--success)' : undefined,
            }}
            title={t.calcLinkTip}
          >
            {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
            {copiedLink ? t.calcLinkCopied : t.calcLinkBtn}
          </button>
          <button
            onClick={() => setShowPdfExportDialog(true)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', minWidth: '80px' }}
            title={t.calcPdfTip}
          >
            <Printer size={16} /> {t.calcPdfBtn}
          </button>
        </div>
      </header>

      <div className="glass-panel hide-print" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { key: 'basics', label: ui.tabBasics },
          { key: 'dashboard', label: ui.tabDashboard },
          { key: 'details', label: ui.tabDetails },
        ].map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? '' : 'outline'}
            onClick={() => {
              setActiveTab(tab.key as AppTab);
              setSelectedExpenseId(null);
            }}
            style={{ minWidth: '140px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showBasicsTab && (
        <div className="glass-panel fade-in delay-2">
          {printAllTabs && (
            <h2 style={{ marginBottom: '1rem' }}>
              {lang === 'de' ? 'Reiter: Eckdaten' : 'Tab: Basics'}
            </h2>
          )}
          <h2 style={{ marginBottom: '1rem' }}>{ui.basicsTitle}</h2>

          <div className="dashboard-grid">
            <div>
              <div className="input-group">
                <label>{ui.weddingName}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wallet size={18} color="var(--text-muted)" />
                  <input
                    type="text"
                    value={basicsDraft.weddingName}
                    onChange={(e) =>
                      setBasicsDraft((prev) => ({
                        ...prev,
                        weddingName: e.target.value.slice(0, MAX_WEDDING_NAME_LENGTH),
                      }))
                    }
                    maxLength={MAX_WEDDING_NAME_LENGTH}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>{ui.weddingDate}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarDays size={18} color="var(--text-muted)" />
                  <div style={{ flex: 1 }}>
                    <DateSelectField
                      value={basicsDraft.weddingDate}
                      onChange={(value) => setBasicsDraft((prev) => ({ ...prev, weddingDate: value }))}
                      minYear={MIN_WEDDING_YEAR}
                      maxYear={MAX_WEDDING_YEAR}
                      placeholder={ui.datePlaceholder}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>{t.setupGuests}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--text-muted)" />
                  <input
                    type="number"
                    value={basicsDraft.guestCount}
                    onChange={(e) =>
                      setBasicsDraft((prev) => ({
                        ...prev,
                        guestCount: clampInt(Number(e.target.value), 1, MAX_GUEST_COUNT),
                      }))
                    }
                    min={1}
                    max={MAX_GUEST_COUNT}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>{t.setupBudget}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="var(--text-muted)" />
                  <input
                    type="number"
                    value={basicsDraft.totalBudget}
                    onChange={(e) =>
                      setBasicsDraft((prev) => ({
                        ...prev,
                        totalBudget: clampInt(Number(e.target.value), 1, MAX_MONEY_AMOUNT),
                      }))
                    }
                    step="500"
                    min={1}
                    max={MAX_MONEY_AMOUNT}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <div
                className="setup-hint"
                dangerouslySetInnerHTML={{ __html: t.setupHint }}
              />

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={saveBasicsAndContinue}>{ui.continueDashboard}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDashboardTab && (
        <div className="glass-panel fade-in delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {printAllTabs && (
            <h2 style={{ marginBottom: 0 }}>
              {lang === 'de' ? 'Reiter: Dashboard' : 'Tab: Dashboard'}
            </h2>
          )}
          {weddingCountdownText ? (
            <div
              className="glass-panel"
              style={{
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(255, 255, 255, 0.04))',
                borderColor: 'rgba(212, 175, 55, 0.35)',
              }}
            >
              <div className="stats-icon">
                <CalendarDays />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <strong style={{ fontSize: '1.02rem' }}>{weddingCountdownText}</strong>
                {formattedWeddingDate ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{formattedWeddingDate}</span>
                ) : null}
              </div>
            </div>
          ) : null}
          {actualOpenAmount > 0 ? (
            <div className="status-warning" role="note">
              <AlertTriangle size={16} />
              <span>
                {lang === 'de'
                  ? `Hinweis: ${formatEuro(actualOpenAmount)} in \"Ausgegeben\" sind noch nicht eingerechnet, da der Status dieser Posten noch nicht auf \"Bezahlt\" oder \"Fertig\" steht.`
                  : `${formatEuro(actualOpenAmount)} entered as spent is not counted yet because those items are not set to Paid or Done.`}
              </span>
            </div>
          ) : null}
          {StatsCards}
          {CalculationHints}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }} title={preliminaryResultTooltip}>
                {t.chartPlanDiffTitle} <Info size={12} style={{ verticalAlign: 'middle' }} />
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={planDiffData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => formatEuro(val)}
                    width={78}
                  />
                  <Tooltip
                    formatter={(value) => {
                      const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                      return formatEuro(numericValue);
                    }}
                    contentStyle={{
                      backgroundColor: 'var(--panel-bg)',
                      borderColor: 'var(--panel-border)',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: 'var(--text-main)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {planDiffData.map((entry) => (
                      <Cell
                        key={`plan-diff-${entry.name}`}
                        fill={entry.value < 0 ? 'var(--danger)' : 'var(--accent-gold)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }} title={totalResultTooltip}>
                {t.chartProfitLossTitle} <Info size={12} style={{ verticalAlign: 'middle' }} />
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={profitLossData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => formatEuro(val)}
                    width={78}
                  />
                  <Tooltip
                    formatter={(value) => {
                      const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                      return formatEuro(numericValue);
                    }}
                    contentStyle={{
                      backgroundColor: 'var(--panel-bg)',
                      borderColor: 'var(--panel-border)',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: 'var(--text-main)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {profitLossData.map((entry) => (
                      <Cell
                        key={`profit-loss-${entry.name}`}
                        fill={entry.value < 0 ? 'var(--danger)' : 'var(--accent-sage)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {t.chartShareTitle}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={sharePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    label={({ name, percent, payload }: { name?: string; percent?: number; payload?: { placeholder?: boolean } }) => {
                      if (payload?.placeholder) return name ?? '';
                      return `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`;
                    }}
                    labelLine={{ stroke: 'var(--text-muted)' }}
                  >
                    {sharePieData.map((entry) => (
                      <Cell key={`share-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _name, payload) => {
                      const isPlaceholder = Boolean((payload as { payload?: { placeholder?: boolean } })?.payload?.placeholder);
                      if (isPlaceholder) return lang === 'de' ? 'Noch keine Ausgaben' : 'No expenses yet';
                      const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                      return formatEuro(numericValue);
                    }}
                    contentStyle={{
                      backgroundColor: 'var(--panel-bg)',
                      borderColor: 'var(--panel-border)',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend
                    iconType="circle"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {showDetailsTableTab && (
        <div className="glass-panel fade-in delay-3">
          {printAllTabs && (
            <h2 style={{ marginBottom: '1rem' }}>
              {lang === 'de' ? 'Reiter: Details' : 'Tab: Details'}
            </h2>
          )}
          <div style={{ marginBottom: '1.5rem' }}>{StatsCards}</div>
          <div style={{ marginBottom: '1.5rem' }}>{CalculationHints}</div>
          {actualOpenAmount > 0 ? (
            <div className="status-warning" role="note" style={{ marginBottom: '1rem' }}>
              <AlertTriangle size={16} />
              <span>
                {lang === 'de'
                  ? `Ein Teil von \"Ausgegeben\" wird nicht eingerechnet (${formatEuro(actualOpenAmount)}), solange der Status auf \"Offen\" oder \"In Arbeit\" steht.`
                  : `Part of "Spent" is not included (${formatEuro(actualOpenAmount)}) while status is Open or In Progress.`}
              </span>
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ fontSize: '1.4rem' }}>{t.tableTitle}</h2>
            <button onClick={addExpense} className="outline hide-print">
              {t.tableAddBtn}
            </button>
          </div>

          <div className="hide-print" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ExpenseStatus | 'all')}
              aria-label={t.filterByStatus}
            >
              <option value="all">{t.filterAllStatuses}</option>
              {(['open', 'in_progress', 'paid', 'done'] as ExpenseStatus[]).map((s) => (
                <option key={s} value={s}>{statusText[s]}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              aria-label={t.filterByCategory}
            >
              <option value="all">{t.filterAllCategories}</option>
              {EXPENSE_CATEGORIES.map((cat, idx) => (
                <option key={cat} value={cat}>{t.categories[idx] ?? cat}</option>
              ))}
            </select>
            {(filterStatus !== 'all' || filterCategory !== 'all' || sortDateAsc !== null) && (
              <button
                className="outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                onClick={() => { setFilterStatus('all'); setFilterCategory('all'); setSortDateAsc(null); }}
              >
                {t.resetFilters}
              </button>
            )}
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '14%' }}>{t.colCategory}</th>
                  <th style={{ width: '20%' }}>{t.colPosition}</th>
                  <th
                    style={{ width: '12%', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
                    onClick={() => setSortDateAsc((prev) => prev === null ? true : prev ? false : null)}
                    title={sortDateAsc === true ? t.sortDesc : t.sortAsc}
                  >
                    {t.colTargetDate}{sortDateAsc === true ? ' ↑' : sortDateAsc === false ? ' ↓' : ''}
                  </th>
                  <th style={{ width: '12%' }}>{t.colStatus}</th>
                  <th style={{ width: '12%' }}>{t.colFactor}</th>
                  <th style={{ width: '12%' }}>{t.colPlanned}</th>
                  <th style={{ width: '12%' }}>{t.colActual}</th>
                  <th className="hide-print" style={{ width: '6%' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    onClick={() => setSelectedExpenseId(exp.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedExpenseId(exp.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    style={{ cursor: 'pointer' }}
                    aria-label={`${selectedCategoryLabel(exp.category)}: ${exp.item}`}
                  >
                    <td style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>
                      {selectedCategoryLabel(exp.category)}
                    </td>

                    <td style={{ color: 'var(--text-main)' }}>
                      {exp.item || t.inputDetails}
                    </td>

                    <td>
                      {exp.targetDate || '\u2014'}
                    </td>

                    <td>
                      {statusText[exp.status]}
                    </td>

                    <td>
                      {exp.isPerPerson
                        ? `${formatEuro(exp.costPerPerson)} / ${t.perPerson}`
                        : ui.fixedAmount}
                    </td>

                    <td>
                      {formatEuro(exp.estimated)}
                    </td>

                    <td>
                      {formatEuro(exp.actual)}
                      {exp.actual > 0 && !CLOSED_STATUSES.has(exp.status) ? (
                        <div className="cell-hint">
                          {lang === 'de' ? 'Noch nicht eingerechnet' : 'Not counted yet'}
                        </div>
                      ) : null}
                    </td>

                    <td className="hide-print" style={{ textAlign: 'center' }}>
                      <button
                        className="text-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExpense(exp.id);
                        }}
                        title={t.deleteRow}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDetailsExpenseTab && (
        <div className="glass-panel fade-in delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="outline" onClick={() => setSelectedExpenseId(null)}>
              <ArrowLeft size={16} /> {ui.backToDetails}
            </button>
            <h2>
              {selectedCategoryLabel(selectedExpense.category)}: {selectedExpense.item}
            </h2>
          </div>

          {StatsCards}

          <div className="dashboard-grid">
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>{ui.editItem}</h3>
              <div className="input-group">
                <label>{ui.category}</label>
                <select
                  value={selectedExpense.category}
                  onChange={(e) => handleExpenseChange(selectedExpense.id, 'category', e.target.value)}
                >
                  {!EXPENSE_CATEGORIES.includes(selectedExpense.category) && (
                    <option value={selectedExpense.category}>{selectedExpense.category}</option>
                  )}
                  {EXPENSE_CATEGORIES.map((cat, i) => (
                    <option key={cat} value={cat}>
                      {t.categories[i] ?? cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>{t.colPosition}</label>
                <input
                  type="text"
                  value={selectedExpense.item}
                  maxLength={MAX_EXPENSE_ITEM_LENGTH}
                  onChange={(e) => handleExpenseChange(selectedExpense.id, 'item', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>{t.colStatus}</label>
                <select
                  value={selectedExpense.status}
                  onChange={(e) =>
                    handleExpenseChange(selectedExpense.id, 'status', e.target.value as ExpenseStatus)
                  }
                >
                  {statusOrder.map((statusKey) => (
                    <option key={statusKey} value={statusKey}>
                      {statusText[statusKey]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>{ui.targetDateItem}</label>
                <DateSelectField
                  value={selectedExpense.targetDate}
                  onChange={(value) => handleExpenseChange(selectedExpense.id, 'targetDate', value)}
                  placeholder={ui.datePlaceholder}
                />
              </div>
              <div className="input-group">
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textTransform: 'none', letterSpacing: 'normal' }}>
                  <input
                    type="checkbox"
                    checked={selectedExpense.isPerPerson}
                    onChange={(e) => togglePerPerson(selectedExpense.id, e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  {t.checkboxGuests}
                </label>
              </div>
              {selectedExpense.isPerPerson && (
                <div className="input-group">
                  <label>{lang === 'de' ? 'Kosten pro Person (€)' : 'Cost per guest (€)'}</label>
                  <input
                    type="number"
                    value={selectedExpense.costPerPerson}
                    min={1}
                    max={MAX_MONEY_AMOUNT}
                    onChange={(e) => handleExpenseChange(selectedExpense.id, 'costPerPerson', Number(e.target.value))}
                  />
                </div>
              )}
              <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{t.colPlanned}</label>
                  <input
                    type="number"
                    value={selectedExpense.estimated}
                    min={1}
                    max={MAX_MONEY_AMOUNT}
                    disabled={selectedExpense.isPerPerson}
                    onChange={(e) => handleExpenseChange(selectedExpense.id, 'estimated', Number(e.target.value))}
                  />
                  {selectedExpense.isPerPerson && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.autoCalc}</div>
                  )}
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{t.colActual}</label>
                  <input
                    type="number"
                    value={selectedExpense.actual}
                    min={0}
                    max={MAX_MONEY_AMOUNT}
                    onChange={(e) => handleExpenseChange(selectedExpense.id, 'actual', Number(e.target.value))}
                  />
                  {selectedExpense.actual > 0 && !CLOSED_STATUSES.has(selectedExpense.status) ? (
                    <div className="cell-hint" style={{ marginTop: '0.35rem' }}>
                      {lang === 'de'
                        ? 'Wird erst im Dashboard berücksichtigt, wenn der Status auf "Bezahlt" oder "Fertig" steht.'
                        : 'Will only count in dashboard after status is set to Paid or Done.'}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>{ui.checklist}</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 340px) auto', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={checklistDraft}
                onChange={(e) => setChecklistDraft(e.target.value.slice(0, MAX_CHECKLIST_ITEM_LENGTH))}
                maxLength={MAX_CHECKLIST_ITEM_LENGTH}
                placeholder={lang === 'de' ? 'Unterpunkt hinzufügen...' : 'Add sub task...'}
              />
              <DateSelectField
                value={checklistDateDraft}
                onChange={setChecklistDateDraft}
                placeholder={ui.datePlaceholder}
              />
              <button onClick={addChecklistItem} style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} /> {ui.add}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedExpense.checklist.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {lang === 'de' ? 'Keine Unterpunkte vorhanden.' : 'No checklist items yet.'}
                </div>
              )}

              {selectedExpense.checklist.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr minmax(280px, 340px) auto',
                    gap: '0.5rem',
                    alignItems: 'center',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 8,
                    padding: '0.55rem 0.65rem',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => updateChecklistItem(selectedExpense.id, item.id, 'done', e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <input
                    type="text"
                    value={item.title}
                    maxLength={MAX_CHECKLIST_ITEM_LENGTH}
                    onChange={(e) => updateChecklistItem(selectedExpense.id, item.id, 'title', e.target.value)}
                    style={{ textDecoration: item.done ? 'line-through' : 'none' }}
                  />
                  <DateSelectField
                    value={item.targetDate}
                    onChange={(value) => updateChecklistItem(selectedExpense.id, item.id, 'targetDate', value)}
                    placeholder={ui.datePlaceholder}
                  />
                  <button
                    className="text-btn"
                    onClick={() => removeChecklistItem(selectedExpense.id, item.id)}
                    title={ui.deleteSubtask}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircle size={18} /> {ui.comments}
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder={lang === 'de' ? 'Kommentar oder Update eingeben...' : 'Write a comment or update...'}
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                maxLength={MAX_COMMENT_LENGTH}
                style={{ flex: 1 }}
              />
              <button onClick={addCommentToExpense}>{ui.send}</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedExpense.updates.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {ui.noHistory}
                </div>
              )}
              {selectedExpense.updates
                .slice()
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((entry) => (
                  <div key={entry.id} style={{ border: '1px solid var(--panel-border)', borderRadius: 8, padding: '0.7rem 0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        {formatDateTime(entry.createdAt)}
                      </div>
                      <button
                        className="text-btn"
                        onClick={() => removeUpdateFromExpense(selectedExpense.id, entry.id)}
                        title={ui.deleteComment}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div>{entry.message}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {showPdfExportDialog && (
        <div
          className="hide-print"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-color)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div className="glass-panel" style={{ width: 'min(520px, 100%)', padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{ui.pdfTitle}</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              {ui.pdfText}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <button className="outline" onClick={() => setShowPdfExportDialog(false)}>
                {ui.cancel}
              </button>
              <button className="outline" onClick={() => handlePdfExport('current')}>
                {ui.exportCurrent}
              </button>
              <button onClick={() => handlePdfExport('all')}>
                {ui.exportAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
