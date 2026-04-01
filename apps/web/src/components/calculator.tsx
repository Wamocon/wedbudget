'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  MapPin,
  Wallet,
  PieChart,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowLeft,
  Trash2,
  Printer,
  Share2,
  Download,
  Check,
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
} from 'recharts';
import { saveToLocal, exportToJson, generateShareUrl } from '@/lib/storage';
import { REGIONAL_MULTIPLIER, EXPENSE_CATEGORIES } from '@/lib/domain';
import { useLanguage } from '@/context/language-context';
import type { Expense, PlanningData } from '@/lib/types';

interface CalculatorProps {
  initialData: PlanningData;
  onBack: () => void;
}

type ChartEntry = Record<string, string | number>;

const formatEuro = (val: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);

export default function Calculator({ initialData, onBack }: CalculatorProps) {
  const { lang, switchLang, t } = useLanguage();

  const [guestCount, setGuestCount] = useState<number>(initialData.guestCount);
  const [region, setRegion] = useState<string>(() => {
    if (initialData.region && Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)) {
      return initialData.region;
    }
    return 'Nordrhein-Westfalen';
  });
  const [totalBudget, setTotalBudget] = useState<number>(initialData.totalBudget);
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setGuestCount(initialData.guestCount);
    setRegion(
      Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)
        ? initialData.region
        : 'Nordrhein-Westfalen',
    );
    setTotalBudget(initialData.totalBudget);
    setExpenses(initialData.expenses);
  }, [initialData]);

  useEffect(() => {
    saveToLocal({ guestCount, region, totalBudget, expenses });
  }, [guestCount, region, totalBudget, expenses]);

  const applyHeuristics = (
    newGuests: number,
    newRegion: string,
    currentExpenses: Expense[],
  ): Expense[] => {
    const multi = REGIONAL_MULTIPLIER[newRegion] ?? 1.0;
    return currentExpenses.map((exp) => {
      if (exp.isPerPerson) {
        return { ...exp, estimated: Math.round(exp.costPerPerson * newGuests * multi) };
      }
      if (exp.category === 'Location' && exp.item === 'Miete & Reinigung') {
        return { ...exp, estimated: Math.round((1500 + newGuests * 15) * multi) };
      }
      return exp;
    });
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setGuestCount(val);
    setExpenses((prev) => applyHeuristics(val, region, prev));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRegion(val);
    setExpenses((prev) => applyHeuristics(guestCount, val, prev));
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
          const multi = REGIONAL_MULTIPLIER[region] ?? 1.0;
          updated.estimated = Math.round((updated.costPerPerson as number) * guestCount * multi);
        }
        if (field === 'estimated' && updated.isPerPerson) {
          updated.isPerPerson = false;
        }
        return updated;
      }),
    );
  };

  const togglePerPerson = (id: string) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id !== id) return exp;
        const newIsPerPerson = !exp.isPerPerson;
        const multi = REGIONAL_MULTIPLIER[region] ?? 1.0;
        let newCostPerPerson = exp.costPerPerson;
        let newEst = exp.estimated;
        if (newIsPerPerson) {
          newCostPerPerson = guestCount > 0 ? Math.round(exp.estimated / guestCount / multi) : 0;
          newEst = Math.round(newCostPerPerson * guestCount * multi);
        }
        return { ...exp, isPerPerson: newIsPerPerson, costPerPerson: newCostPerPerson, estimated: newEst };
      }),
    );
  };

  const togglePaid = (id: string) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, paid: !exp.paid } : exp)),
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
        estimated: 0,
        actual: 0,
        paid: false,
        comment: '',
        isPerPerson: false,
        costPerPerson: 0,
      },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleShare = () => {
    const url = generateShareUrl({ guestCount, region, totalBudget, expenses });
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(console.error);
  };

  const handleExport = () => {
    exportToJson({ guestCount, region, totalBudget, expenses });
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
        grouped[label] = { name: label, [t.chartPlanned]: 0, [t.chartActual]: 0 };
      }
      (grouped[label][t.chartPlanned] as number) += Number(exp.estimated) || 0;
      (grouped[label][t.chartActual] as number) += Number(exp.actual) || 0;
    });

    return Object.values(grouped).filter(
      (d) => (d[t.chartPlanned] as number) > 0 || (d[t.chartActual] as number) > 0,
    );
  }, [expenses, t]);

  return (
    <div className="app-container fade-in">
      {/* HEADER */}
      <header className="calc-header fade-in delay-1">
        <div className="calc-header__left hide-print">
          <button onClick={onBack} className="outline" style={{ padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> {t.calcBack}
          </button>
        </div>

        <div className="calc-header__center">
          <h1>{t.calcTitle}</h1>
          <p>{t.calcSubtitle}</p>
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
            onClick={() => window.print()}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
            title={t.calcPdfTip}
          >
            <Printer size={16} /> {t.calcPdfBtn}
          </button>
        </div>
      </header>

      {/* TOP ROW: SETUP + STATS/CHART */}
      <div className="dashboard-grid">
        {/* SETUP PANEL */}
        <div className="glass-panel fade-in delay-2">
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '1.4rem',
            }}
          >
            <Wallet size={24} color="var(--accent-gold)" /> {t.setupTitle}
          </h2>

          <div className="input-group">
            <label>{t.setupGuests}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--text-muted)" />
              <input
                type="number"
                value={guestCount}
                onChange={handleGuestCountChange}
                min="10"
                max="500"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="input-group">
            <label>{t.setupRegion}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--text-muted)" />
              <select value={region} onChange={handleRegionChange} style={{ flex: 1 }}>
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
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                step="500"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div
            className="setup-hint"
            dangerouslySetInnerHTML={{
              __html: t.setupHint(t.regions[region] ?? region),
            }}
          />
        </div>

        {/* STATS + CHART */}
        <div
          className="glass-panel fade-in delay-2"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
                  background:
                    remainingBudget < 0
                      ? 'rgba(207, 102, 121, 0.1)'
                      : 'rgba(102, 187, 106, 0.1)',
                  color: remainingBudget < 0 ? 'var(--danger)' : 'var(--success)',
                }}
              >
                <PieChart />
              </div>
              <div className="stats-info">
                <h3>{t.statBuffer}</h3>
                <div
                  className="value"
                  style={{
                    color: remainingBudget < 0 ? 'var(--danger)' : 'var(--success)',
                  }}
                >
                  {formatEuro(remainingBudget)}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              marginTop: '1rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              {t.chartTitle}
            </h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--panel-border)"
                  vertical={false}
                />
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => formatEuro(Number(value))}
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
                />
                <Bar
                  dataKey={t.chartPlanned}
                  fill="var(--accent-gold)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={t.chartActual}
                  fill="var(--accent-sage)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EXPENSES TABLE */}
      <div className="glass-panel fade-in delay-3">
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
                <th style={{ width: '5%' }}>{t.colStatus}</th>
                <th style={{ width: '20%' }}>{t.colPosition}</th>
                <th style={{ width: '20%' }}>{t.colComment}</th>
                <th style={{ width: '15%' }}>{t.colFactor}</th>
                <th style={{ width: '15%' }}>{t.colPlanned}</th>
                <th style={{ width: '15%' }}>{t.colActual}</th>
                <th className="hide-print" style={{ width: '5%' }}></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  {/* Status */}
                  <td style={{ textAlign: 'center' }}>
                    <div
                      onClick={() => togglePaid(exp.id)}
                      style={{ cursor: 'pointer', display: 'inline-block' }}
                      title={exp.paid ? t.statusMarkUnpaid : t.statusMarkPaid}
                    >
                      {exp.paid ? (
                        <CheckCircle color="var(--success)" />
                      ) : (
                        <Clock color="var(--text-muted)" />
                      )}
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          marginTop: '4px',
                        }}
                      >
                        {exp.paid ? t.statusPaid : t.statusOpen}
                      </div>
                    </div>
                  </td>

                  {/* Position */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <select
                        value={exp.category}
                        onChange={(e) =>
                          handleExpenseChange(exp.id, 'category', e.target.value)
                        }
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          fontWeight: 600,
                          color: 'var(--accent-gold)',
                          width: '100%',
                          cursor: 'pointer',
                          appearance: 'none',
                          outline: 'none',
                        }}
                      >
                        {!EXPENSE_CATEGORIES.includes(exp.category) && (
                          <option value={exp.category}>{exp.category}</option>
                        )}
                        {EXPENSE_CATEGORIES.map((cat, i) => (
                          <option key={cat} value={cat}>
                            {t.categories[i] ?? cat}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={exp.item}
                        placeholder={t.inputDetails}
                        onChange={(e) => handleExpenseChange(exp.id, 'item', e.target.value)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="editable-cell">
                    <textarea
                      placeholder={t.inputNotes}
                      value={exp.comment}
                      onChange={(e) => handleExpenseChange(exp.id, 'comment', e.target.value)}
                    />
                  </td>

                  {/* Per Person Factor */}
                  <td className="editable-cell">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={exp.isPerPerson}
                        onChange={() => togglePerPerson(exp.id)}
                        id={`cb-${exp.id}`}
                        style={{ width: 'auto' }}
                      />
                      <label
                        htmlFor={`cb-${exp.id}`}
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        {t.checkboxGuests}
                      </label>
                    </div>
                    {exp.isPerPerson && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>€</span>
                        <input
                          type="number"
                          className="number-input"
                          value={exp.costPerPerson}
                          title={t.perPerson}
                          onChange={(e) =>
                            handleExpenseChange(exp.id, 'costPerPerson', Number(e.target.value))
                          }
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {t.perPerson}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Planned */}
                  <td className="editable-cell">
                    <input
                      type="number"
                      className="number-input"
                      value={exp.estimated}
                      onChange={(e) =>
                        handleExpenseChange(exp.id, 'estimated', Number(e.target.value))
                      }
                    />
                    {exp.isPerPerson && (
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          marginTop: '4px',
                        }}
                      >
                        {t.autoCalc}
                      </div>
                    )}
                  </td>

                  {/* Actual */}
                  <td className="editable-cell">
                    <input
                      type="number"
                      className="number-input"
                      value={exp.actual}
                      onChange={(e) =>
                        handleExpenseChange(exp.id, 'actual', Number(e.target.value))
                      }
                    />
                  </td>

                  {/* Delete */}
                  <td className="hide-print" style={{ textAlign: 'center' }}>
                    <button
                      className="text-btn"
                      onClick={() => removeExpense(exp.id)}
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
    </div>
  );
}
