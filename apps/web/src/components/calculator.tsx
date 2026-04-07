'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Check,
  Download,
  ImagePlus,
  Plus,
  MessageCircle,
  Wallet,
  PieChart,
  CheckCircle,
  TrendingUp,
  Users,
  MapPin,
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
import { saveToLocal, exportToJson, generateShareUrl } from '@/lib/storage';
import { REGIONAL_MULTIPLIER, EXPENSE_CATEGORIES } from '@/lib/domain';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import type { ChecklistItem, Expense, ExpenseStatus, PlanningData } from '@/lib/types';

interface CalculatorProps {
  initialData: PlanningData;
  onBack: () => void;
  initialTab?: 'basics' | 'dashboard';
}

type AppTab = 'basics' | 'dashboard' | 'details';
type ChartMode = 'bar' | 'pie';
type ChartEntry = {
  name: string;
  planned: number;
  actual: number;
};

const MAX_WEDDING_NAME_LENGTH = 50;
const MAX_GUEST_COUNT = 999;
const MAX_MONEY_AMOUNT = 9999999;
const MAX_COMMENT_LENGTH = 250;
const MAX_CHECKLIST_ITEM_LENGTH = 100;

const clampInt = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
};

const formatEuro = (val: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);

const statusOrder: ExpenseStatus[] = ['open', 'in_progress', 'paid', 'done'];

const PIE_COLORS = [
  '#b8894e', '#7e998c', '#c85a6e', '#4a9b69', '#6b8cce',
  '#d4a76a', '#9b7cb8', '#5ba3a3', '#c9826e', '#8aab5e',
  '#b07090', '#7ab0d4', '#c2a048', '#6e9e7e',
];

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Ungueltiges Bildformat'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Fehler beim Lesen der Datei'));
    reader.readAsDataURL(file);
  });
}

export default function Calculator({ initialData, onBack, initialTab = 'dashboard' }: CalculatorProps) {
  const { lang, switchLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AppTab>(initialTab);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [weddingName, setWeddingName] = useState(
    (initialData.weddingName || 'Unsere Hochzeit').slice(0, MAX_WEDDING_NAME_LENGTH),
  );
  const [weddingDate, setWeddingDate] = useState(initialData.weddingDate || '');

  const [guestCount, setGuestCount] = useState<number>(
    clampInt(initialData.guestCount, 1, MAX_GUEST_COUNT),
  );
  const [region, setRegion] = useState<string>(() => {
    if (initialData.region && Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)) {
      return initialData.region;
    }
    return 'Nordrhein-Westfalen';
  });
  const [totalBudget, setTotalBudget] = useState<number>(
    clampInt(initialData.totalBudget, 1, MAX_MONEY_AMOUNT),
  );
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses);
  const [chartMode, setChartMode] = useState<ChartMode>('bar');
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
    region:
      initialData.region && Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)
        ? initialData.region
        : 'Nordrhein-Westfalen',
    totalBudget: clampInt(initialData.totalBudget, 1, MAX_MONEY_AMOUNT),
  }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const expenseParam = params.get('expense');

    if (tabParam === 'basics' || tabParam === 'dashboard' || tabParam === 'details') {
      setActiveTab(tabParam);
    }

    if (expenseParam) {
      setActiveTab('details');
      setSelectedExpenseId(expenseParam);
    }
  }, []);

  useEffect(() => {
    setWeddingName((initialData.weddingName || 'Unsere Hochzeit').slice(0, MAX_WEDDING_NAME_LENGTH));
    setWeddingDate(initialData.weddingDate || '');
    setGuestCount(clampInt(initialData.guestCount, 1, MAX_GUEST_COUNT));
    setRegion(
      Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)
        ? initialData.region
        : 'Nordrhein-Westfalen',
    );
    setTotalBudget(clampInt(initialData.totalBudget, 1, MAX_MONEY_AMOUNT));
    setExpenses(initialData.expenses);
    setBasicsDraft({
      weddingName: (initialData.weddingName || 'Unsere Hochzeit').slice(0, MAX_WEDDING_NAME_LENGTH),
      weddingDate: initialData.weddingDate || '',
      guestCount: clampInt(initialData.guestCount, 1, MAX_GUEST_COUNT),
      region:
        initialData.region && Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)
          ? initialData.region
          : 'Nordrhein-Westfalen',
      totalBudget: clampInt(initialData.totalBudget, 1, MAX_MONEY_AMOUNT),
    });
    setActiveTab(initialTab);
  }, [initialData, initialTab]);

  useEffect(() => {
    saveToLocal({ weddingName, weddingDate, guestCount, region, totalBudget, expenses });
  }, [weddingName, weddingDate, guestCount, region, totalBudget, expenses]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    if (selectedExpenseId) url.searchParams.set('expense', selectedExpenseId);
    else url.searchParams.delete('expense');
    window.history.replaceState({}, document.title, `${url.pathname}?${url.searchParams.toString()}`);
  }, [activeTab, selectedExpenseId]);

  useEffect(() => {
    if (!pendingPdfPrintMode) return;

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
  }, [pendingPdfPrintMode]);

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
    const nextRegion = Object.keys(REGIONAL_MULTIPLIER).includes(basicsDraft.region)
      ? basicsDraft.region
      : 'Nordrhein-Westfalen';
    const nextName = (basicsDraft.weddingName || '').trim().slice(0, MAX_WEDDING_NAME_LENGTH);

    const shouldRecalc = nextGuests !== guestCount || nextRegion !== region;

    setWeddingName(nextName.length > 0 ? nextName : (lang === 'de' ? 'Unsere Hochzeit' : 'Our Wedding'));
    setWeddingDate(basicsDraft.weddingDate || '');
    setGuestCount(nextGuests);
    setRegion(nextRegion);
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
          updated.estimated = clampInt((updated.costPerPerson as number) * guestCount, 1, MAX_MONEY_AMOUNT);
        }
        if (field === 'estimated') {
          updated.estimated = clampInt(Number(value), 1, MAX_MONEY_AMOUNT);
        }
        if (field === 'actual') {
          updated.actual = clampInt(Number(value), 1, MAX_MONEY_AMOUNT);
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
        actual: 1,
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
    const url = generateShareUrl({ weddingName, weddingDate, guestCount, region, totalBudget, expenses });
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(console.error);
  };

  const handleExport = () => {
    exportToJson({ weddingName, weddingDate, guestCount, region, totalBudget, expenses });
  };

  const handlePdfExport = (mode: 'current' | 'all') => {
    setShowPdfExportDialog(false);

    if (mode === 'all') {
      printRestoreStateRef.current = { activeTab, selectedExpenseId };
      setPrintAllTabs(true);
      setSelectedExpenseId(null);
    }

    setPendingPdfPrintMode(mode);
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
        return {
          ...exp,
          checklist: exp.checklist.map((item) =>
            item.id === checklistId
              ? {
                  ...item,
                  [field]: value,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedExpense) return;
    const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;

    try {
      const encoded = await Promise.all(files.map((file) => toDataUrl(file).then((dataUrl) => ({
        id: `a-${Math.random().toString(36).slice(2, 10)}`,
        name: file.name,
        dataUrl,
        createdAt: new Date().toISOString(),
      }))));

      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === selectedExpense.id
            ? { ...exp, attachments: [...exp.attachments, ...encoded] }
            : exp,
        ),
      );
    } finally {
      e.target.value = '';
    }
  };

  const removeAttachment = (expenseId: string, attachmentId: string) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === expenseId
          ? {
              ...exp,
              attachments: exp.attachments.filter((att) => att.id !== attachmentId),
            }
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
  const totalActual = expenses.reduce((a, b) => a + Number(b.actual || 0), 0);
  const remainingBudget = totalBudget - Math.max(totalEstimated, totalActual);

  const chartData = useMemo<ChartEntry[]>(() => {
    const catIndex: Record<string, string> = {};
    EXPENSE_CATEGORIES.forEach((cat, i) => {
      catIndex[cat] = t.categories[i] ?? cat;
    });

    const grouped: Record<string, ChartEntry> = {};
    expenses.forEach((exp) => {
      const label = catIndex[exp.category] ?? exp.category;
      if (!grouped[label]) {
        grouped[label] = { name: label, planned: 0, actual: 0 };
      }
      grouped[label].planned += Number(exp.estimated) || 0;
      grouped[label].actual += Number(exp.actual) || 0;
    });

    return Object.values(grouped).filter(
      (d) => d.planned > 0 || d.actual > 0,
    );
  }, [expenses, t]);

  const StatsCards = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: '1rem' }}>
      <div className="stats-card">
        <div className="stats-icon">
          <Wallet />
        </div>
        <div className="stats-info">
          <h3>{t.statPlanned}</h3>
          <div className="value">{formatEuro(totalEstimated)}</div>
        </div>
      </div>
      <div className="stats-card">
        <div className="stats-icon">
          <CheckCircle />
        </div>
        <div className="stats-info">
          <h3>{t.statActual}</h3>
          <div className="value">{formatEuro(totalActual)}</div>
        </div>
      </div>
      <div className="stats-card">
        <div
          className="stats-icon"
          style={{
            background: remainingBudget < 0 ? 'rgba(207, 102, 121, 0.1)' : 'rgba(102, 187, 106, 0.1)',
            color: remainingBudget < 0 ? 'var(--danger)' : 'var(--success)',
          }}
        >
          <PieChart />
        </div>
        <div className="stats-info">
          <h3>{t.statBuffer}</h3>
          <div className="value" style={{ color: remainingBudget < 0 ? 'var(--danger)' : 'var(--success)' }}>
            {formatEuro(remainingBudget)}
          </div>
        </div>
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
          {weddingDate ? <p style={{ fontSize: '0.9rem' }}>{weddingDate}</p> : null}
        </div>

        <div className="calc-header__right hide-print">
          <div className="lang-switcher">
            <button
              className={`lang-btn ${lang === 'de' ? 'lang-btn--active' : ''}`}
              onClick={() => switchLang('de')}
              title="Deutsch"
            >
              🇩🇪 DE
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`}
              onClick={() => switchLang('en')}
              title="English"
            >
              🇬🇧 EN
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
            title={theme === 'dark' ? 'Light-Mode aktivieren' : 'Dark-Mode aktivieren'}
            suppressHydrationWarning
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={handleExport}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
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
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
            title={t.calcPdfTip}
          >
            <Printer size={16} /> {t.calcPdfBtn}
          </button>
        </div>
      </header>

      <div className="glass-panel" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { key: 'basics', label: 'Eckdaten' },
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'details', label: 'Details' },
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
          <h2 style={{ marginBottom: '1rem' }}>Eckdaten der Hochzeit</h2>

          <div className="dashboard-grid">
            <div>
              <div className="input-group">
                <label>Hochzeitsname</label>
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
                <label>Hochzeitsdatum</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarDays size={18} color="var(--text-muted)" />
                  <input
                    type="date"
                    value={basicsDraft.weddingDate}
                    onChange={(e) =>
                      setBasicsDraft((prev) => ({ ...prev, weddingDate: e.target.value }))
                    }
                    style={{ flex: 1 }}
                  />
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
                <label>{t.setupRegion}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--text-muted)" />
                  <select
                    value={basicsDraft.region}
                    onChange={(e) =>
                      setBasicsDraft((prev) => ({ ...prev, region: e.target.value }))
                    }
                    style={{ flex: 1 }}
                  >
                    {Object.keys(REGIONAL_MULTIPLIER).map((r) => (
                      <option key={r} value={r}>
                        {t.regions[r] ?? r}
                      </option>
                    ))}
                  </select>
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
                dangerouslySetInnerHTML={{ __html: t.setupHint(t.regions[basicsDraft.region] ?? basicsDraft.region) }}
              />

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={saveBasicsAndContinue}>Änderungen übernehmen</button>
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
          {StatsCards}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                }}
              >
                {t.chartTitle}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={chartMode === 'bar' ? '' : 'outline'}
                  onClick={() => setChartMode('bar')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                >
                  {lang === 'de' ? 'Balken' : 'Bar'}
                </button>
                <button
                  className={chartMode === 'pie' ? '' : 'outline'}
                  onClick={() => setChartMode('pie')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                >
                  {lang === 'de' ? 'Torte' : 'Pie'}
                </button>
              </div>
            </div>

            {chartMode === 'bar' && (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val: number) => `€${val}`}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                      const label = name === 'planned' ? t.chartPlanned : t.chartActual;
                      return [formatEuro(numericValue), label];
                    }}
                    contentStyle={{
                      backgroundColor: 'var(--panel-bg)',
                      borderColor: 'var(--panel-border)',
                      borderRadius: '8px',
                    }}
                    itemStyle={{ color: 'var(--text-main)' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    formatter={(value: string) => (value === 'planned' ? t.chartPlanned : t.chartActual)}
                  />
                  <Bar dataKey="planned" fill="var(--accent-gold)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="var(--accent-sage)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartMode === 'pie' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h4 style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {t.chartPlanned}
                  </h4>
                  <ResponsiveContainer width="100%" height={340}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.filter((d) => d.planned > 0)}
                        dataKey="planned"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`
                        }
                        labelLine={{ stroke: 'var(--text-muted)' }}
                      >
                        {chartData.filter((d) => d.planned > 0).map((_, i) => (
                          <Cell
                            key={`planned-${i}`}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
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
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {t.chartActual}
                  </h4>
                  <ResponsiveContainer width="100%" height={340}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.filter((d) => d.actual > 0)}
                        dataKey="actual"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`
                        }
                        labelLine={{ stroke: 'var(--text-muted)' }}
                      >
                        {chartData.filter((d) => d.actual > 0).map((_, i) => (
                          <Cell
                            key={`actual-${i}`}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
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
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
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

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>{t.colPosition}</th>
                  <th style={{ width: '14%' }}>{t.colTargetDate}</th>
                  <th style={{ width: '14%' }}>{t.colStatus}</th>
                  <th style={{ width: '14%' }}>{t.colFactor}</th>
                  <th style={{ width: '14%' }}>{t.colPlanned}</th>
                  <th style={{ width: '14%' }}>{t.colActual}</th>
                  <th className="hide-print" style={{ width: '8%' }}></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
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
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>
                          {selectedCategoryLabel(exp.category)}
                        </div>
                        <div style={{ color: 'var(--text-main)' }}>{exp.item || t.inputDetails}</div>
                      </div>
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
                        : (lang === 'de' ? 'Fixbetrag' : 'Fixed amount')}
                    </td>

                    <td>
                      {formatEuro(exp.estimated)}
                    </td>

                    <td>
                      {formatEuro(exp.actual)}
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
              <ArrowLeft size={16} /> Zurueck zu Details
            </button>
            <h2>
              {selectedCategoryLabel(selectedExpense.category)}: {selectedExpense.item}
            </h2>
          </div>

          {StatsCards}

          <div className="dashboard-grid">
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Posten bearbeiten</h3>
              <div className="input-group">
                <label>Kategorie</label>
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
                <label>{lang === 'de' ? 'Zieldatum (Posten)' : 'Target date (item)'}</label>
                <input
                  type="date"
                  value={selectedExpense.targetDate}
                  onChange={(e) => handleExpenseChange(selectedExpense.id, 'targetDate', e.target.value)}
                />
              </div>
              <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{t.colPlanned}</label>
                  <input
                    type="number"
                    value={selectedExpense.estimated}
                    min={1}
                    max={MAX_MONEY_AMOUNT}
                    onChange={(e) => handleExpenseChange(selectedExpense.id, 'estimated', Number(e.target.value))}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>{t.colActual}</label>
                  <input
                    type="number"
                    value={selectedExpense.actual}
                    min={1}
                    max={MAX_MONEY_AMOUNT}
                    onChange={(e) => handleExpenseChange(selectedExpense.id, 'actual', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImagePlus size={18} /> Bilder
              </h3>
              <label style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
                <span className="outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.9rem', borderRadius: 8, cursor: 'pointer', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)' }}>
                  <ImagePlus size={16} /> Bilder hochladen
                </span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {selectedExpense.attachments.map((att) => (
                  <div key={att.id} style={{ border: '1px solid var(--panel-border)', borderRadius: 8, overflow: 'hidden' }}>
                    <Image
                      src={att.dataUrl}
                      alt={att.name}
                      width={260}
                      height={96}
                      unoptimized
                      style={{ width: '100%', height: 96, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: '0.45rem', fontSize: '0.75rem' }}>
                      <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{att.name}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{formatDateTime(att.createdAt)}</div>
                      <button className="text-btn" style={{ marginTop: '0.25rem' }} onClick={() => removeAttachment(selectedExpense.id, att.id)}>
                        Entfernen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>
              {lang === 'de' ? 'Checkliste' : 'Checklist'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={checklistDraft}
                onChange={(e) => setChecklistDraft(e.target.value.slice(0, MAX_CHECKLIST_ITEM_LENGTH))}
                maxLength={MAX_CHECKLIST_ITEM_LENGTH}
                placeholder={lang === 'de' ? 'Unterpunkt hinzufügen...' : 'Add sub task...'}
              />
              <input
                type="date"
                value={checklistDateDraft}
                onChange={(e) => setChecklistDateDraft(e.target.value)}
              />
              <button onClick={addChecklistItem} style={{ whiteSpace: 'nowrap' }}>
                <Plus size={16} /> {lang === 'de' ? 'Hinzufuegen' : 'Add'}
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
                    gridTemplateColumns: 'auto 1fr 180px auto',
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
                    onChange={(e) => updateChecklistItem(selectedExpense.id, item.id, 'title', e.target.value)}
                    style={{ textDecoration: item.done ? 'line-through' : 'none' }}
                  />
                  <input
                    type="date"
                    value={item.targetDate}
                    onChange={(e) => updateChecklistItem(selectedExpense.id, item.id, 'targetDate', e.target.value)}
                  />
                  <button
                    className="text-btn"
                    onClick={() => removeChecklistItem(selectedExpense.id, item.id)}
                    title={lang === 'de' ? 'Unterpunkt loeschen' : 'Delete item'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircle size={18} /> Historie und Kommentare
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
              <button onClick={addCommentToExpense}>Senden</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {selectedExpense.updates.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {lang === 'de' ? 'Noch keine Historie vorhanden.' : 'No history yet.'}
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
                        title={lang === 'de' ? 'Kommentar loeschen' : 'Delete comment'}
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
            background: 'rgba(0, 0, 0, 0.35)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 40,
            padding: '1rem',
          }}
        >
          <div className="glass-panel" style={{ width: 'min(520px, 100%)', padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{lang === 'de' ? 'PDF-Export' : 'PDF export'}</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              {lang === 'de'
                ? 'Bitte waehlen: nur aktueller Reiter oder alle drei Reiter untereinander.'
                : 'Choose whether to export only the current tab or all three tabs stacked.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'flex-end' }}>
              <button className="outline" onClick={() => setShowPdfExportDialog(false)}>
                {lang === 'de' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button className="outline" onClick={() => handlePdfExport('current')}>
                {lang === 'de' ? 'Aktuellen Reiter exportieren' : 'Export current tab'}
              </button>
              <button onClick={() => handlePdfExport('all')}>
                {lang === 'de' ? 'Alle Reiter exportieren' : 'Export all tabs'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
