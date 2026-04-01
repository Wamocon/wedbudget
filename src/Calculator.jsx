import React, { useState, useEffect, useMemo } from 'react';
import {
    Users, MapPin, Wallet, PieChart, TrendingUp, CheckCircle, Clock, ArrowLeft, Trash2, Printer, Share2, Download, Check
} from 'lucide-react';
import {
    PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { saveToLocal, exportToJson, generateShareUrl } from './storage';
import { useLanguage } from './LanguageContext';
import './print.css';

const REGIONAL_MULTIPLIER = {
    'Baden-Württemberg': 1.15,
    'Bayern': 1.2,
    'Berlin': 1.1,
    'Brandenburg': 0.9,
    'Bremen': 1.05,
    'Hamburg': 1.25,
    'Hessen': 1.15,
    'Mecklenburg-Vorpommern': 0.85,
    'Niedersachsen': 1.0,
    'Nordrhein-Westfalen': 1.1,
    'Rheinland-Pfalz': 1.05,
    'Saarland': 0.95,
    'Sachsen': 0.85,
    'Sachsen-Anhalt': 0.85,
    'Schleswig-Holstein': 1.05,
    'Thüringen': 0.85,
    'International': 1.5,
};

const COLORS = ['#cfaa71', '#819888', '#cf6679', '#66bb6a', '#a1887f', '#9aa0a6', '#607d8b'];

// Internal canonical category keys (always German, used as data keys)
const EXPENSE_CATEGORIES = [
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

export default function Calculator({ initialData, onBack }) {
    const { lang, switchLang, t } = useLanguage();

    const [guestCount, setGuestCount] = useState(initialData?.guestCount || 80);
    const [region, setRegion] = useState(() => {
        if (initialData?.region && Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)) {
            return initialData.region;
        }
        return 'Nordrhein-Westfalen';
    });
    const [totalBudget, setTotalBudget] = useState(initialData?.totalBudget || 25000);
    const [expenses, setExpenses] = useState(initialData?.expenses || []);
    const [copiedLink, setCopiedLink] = useState(false);

    // Initialize from props if they change (e.g., loaded new data from JSON or URL)
    useEffect(() => {
        if (initialData) {
            setGuestCount(initialData.guestCount);
            if (Object.keys(REGIONAL_MULTIPLIER).includes(initialData.region)) {
                setRegion(initialData.region);
            } else {
                setRegion('Nordrhein-Westfalen');
            }
            setTotalBudget(initialData.totalBudget);
            setExpenses(initialData.expenses);
        }
    }, [initialData]);

    // Autosave to local storage on any change
    useEffect(() => {
        saveToLocal({ guestCount, region, totalBudget, expenses });
    }, [guestCount, region, totalBudget, expenses]);


    const applyHeuristics = (newGuests, newRegion, currentExpenses) => {
        const multi = REGIONAL_MULTIPLIER[newRegion] || 1.0;

        return currentExpenses.map(exp => {
            let newEst = exp.estimated;
            // Recalculate if it's dependent on guest count dynamically
            if (exp.isPerPerson) {
                newEst = Math.round(exp.costPerPerson * newGuests * multi);
            } else {
                // Simple base logic specific to location if scaling guest count
                if (exp.category === 'Location' && exp.item === 'Miete & Reinigung') {
                    newEst = Math.round((1500 + newGuests * 15) * multi);
                }
            }
            return { ...exp, estimated: newEst };
        });
    };

    const handleGuestCountChange = (e) => {
        const val = Number(e.target.value);
        setGuestCount(val);
        setExpenses(prev => applyHeuristics(val, region, prev));
    };

    const handleRegionChange = (e) => {
        const val = e.target.value;
        setRegion(val);
        setExpenses(prev => applyHeuristics(guestCount, val, prev));
    };

    const handleExpenseChange = (id, field, value) => {
        setExpenses(prev => prev.map(exp => {
            if (exp.id === id) {
                const updated = { ...exp, [field]: value };
                // If costPerPerson was manually updated by user, recalculate estimated immediately
                if (field === 'costPerPerson' && updated.isPerPerson) {
                    const multi = REGIONAL_MULTIPLIER[region] || 1.0;
                    updated.estimated = Math.round(value * guestCount * multi);
                }
                // If user manually overwrites estimated on a perPerson field, detach perPerson
                if (field === 'estimated' && updated.isPerPerson) {
                    updated.isPerPerson = false;
                }
                return updated;
            }
            return exp;
        }));
    };

    const togglePerPerson = (id) => {
        setExpenses(prev => prev.map(exp => {
            if (exp.id === id) {
                const newIsPerPerson = !exp.isPerPerson;
                const multi = REGIONAL_MULTIPLIER[region] || 1.0;
                let newCostPerPerson = exp.costPerPerson;
                let newEst = exp.estimated;

                if (newIsPerPerson) {
                    // Derive costPerPerson from current estimated
                    newCostPerPerson = Math.round(exp.estimated / guestCount / multi);
                    newEst = Math.round(newCostPerPerson * guestCount * multi);
                }

                return { ...exp, isPerPerson: newIsPerPerson, costPerPerson: newCostPerPerson, estimated: newEst };
            }
            return exp;
        }));
    };

    const togglePaid = (id) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === id ? { ...exp, paid: !exp.paid } : exp
        ));
    };

    const addExpense = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setExpenses([...expenses, {
            id: newId,
            category: 'Sonstiges',
            item: t.newExpenseItem,
            estimated: 0,
            actual: 0,
            paid: false,
            comment: '',
            isPerPerson: false,
            costPerPerson: 0
        }]);
    };

    const removeExpense = (id) => {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
    };

    const handleShare = () => {
        const url = generateShareUrl({ guestCount, region, totalBudget, expenses });
        navigator.clipboard.writeText(url).then(() => {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 3000);
        });
    };

    const handleExport = () => {
        exportToJson({ guestCount, region, totalBudget, expenses });
    };

    // Calculations
    const totalEstimated = expenses.reduce((a, b) => a + Number(b.estimated || 0), 0);
    const totalActual = expenses.reduce((a, b) => a + Number(b.actual || 0), 0);
    const totalPaid = expenses.reduce((a, b) => a + (b.paid ? Number(b.actual || b.estimated) : 0), 0);
    const remainingBudget = totalBudget - Math.max(totalEstimated, totalActual);

    // Chart data uses localized labels for the category name shown in chart
    const chartData = useMemo(() => {
        // Map canonical category key → localized label
        const catIndex = EXPENSE_CATEGORIES.reduce((acc, cat, i) => {
            acc[cat] = t.categories[i] || cat;
            return acc;
        }, {});

        const grouped = expenses.reduce((acc, exp) => {
            const label = catIndex[exp.category] || exp.category;
            if (!acc[label]) {
                acc[label] = { name: label, [t.chartPlanned]: 0, [t.chartActual]: 0 };
            }
            acc[label][t.chartPlanned] += Number(exp.estimated) || 0;
            acc[label][t.chartActual] += Number(exp.actual) || 0;
            return acc;
        }, {});

        return Object.values(grouped).filter(d => d[t.chartPlanned] > 0 || d[t.chartActual] > 0);
    }, [expenses, lang, t]);

    const formatEuro = (val) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);

    return (
        <div className="app-container fade-in">
            <header className="calc-header fade-in delay-1">
                {/* LEFT – back button */}
                <div className="calc-header__left hide-print">
                    <button onClick={onBack} className="outline" style={{ padding: '0.4rem 0.8rem' }}>
                        <ArrowLeft size={16} /> {t.calcBack}
                    </button>
                </div>

                {/* CENTER – title */}
                <div className="calc-header__center">
                    <h1>{t.calcTitle}</h1>
                    <p>{t.calcSubtitle}</p>
                </div>

                {/* RIGHT – lang switcher + action buttons */}
                <div className="calc-header__right hide-print">
                    <div className="lang-switcher">
                        <button
                            className={`lang-btn ${lang === 'de' ? 'lang-btn--active' : ''}`}
                            onClick={() => switchLang('de')}
                            title="Deutsch"
                            aria-label="Sprache: Deutsch"
                        >
                            🇩🇪 DE
                        </button>
                        <button
                            className={`lang-btn ${lang === 'ru' ? 'lang-btn--active' : ''}`}
                            onClick={() => switchLang('ru')}
                            title="Русский"
                            aria-label="Язык: Русский"
                        >
                            🇷🇺 RU
                        </button>
                    </div>
                    <button onClick={handleExport} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} title={t.calcFileTip}>
                        <Download size={16} /> {t.calcFileBtn}
                    </button>
                    <button onClick={handleShare} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', color: copiedLink ? 'var(--success)' : '' }} title={t.calcLinkTip}>
                        {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
                        {copiedLink ? t.calcLinkCopied : t.calcLinkBtn}
                    </button>
                    <button onClick={() => window.print()} className="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} title={t.calcPdfTip}>
                        <Printer size={16} /> {t.calcPdfBtn}
                    </button>
                </div>
            </header>

            <div className="dashboard-grid">
                {/* SETUP PANEL */}
                <div className="glass-panel fade-in delay-2">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.4rem' }}>
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
                                min="10" max="500"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>{t.setupRegion}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={18} color="var(--text-muted)" />
                            <select value={region} onChange={handleRegionChange} style={{ flex: 1 }}>
                                {Object.keys(REGIONAL_MULTIPLIER).map(r => (
                                    <option key={r} value={r}>{t.regions[r] || r}</option>
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
                    <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}
                        dangerouslySetInnerHTML={{ __html: t.setupHint(t.regions[region] || region) }}
                    />
                </div>

                {/* STATS & CHART */}
                <div className="glass-panel fade-in delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="stats-card">
                            <div className="stats-icon"><Wallet /></div>
                            <div className="stats-info">
                                <h3>{t.statPlanned}</h3>
                                <div className="value">{formatEuro(totalEstimated)}</div>
                            </div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-icon"><CheckCircle /></div>
                            <div className="stats-info">
                                <h3>{t.statActual}</h3>
                                <div className="value">{formatEuro(totalActual)}</div>
                            </div>
                        </div>
                        <div className="stats-card">
                            <div className="stats-icon" style={{ background: remainingBudget < 0 ? 'rgba(207, 102, 121, 0.1)' : 'rgba(102, 187, 106, 0.1)', color: remainingBudget < 0 ? 'var(--danger)' : 'var(--success)' }}>
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

                    <div style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>{t.chartTitle}</h3>
                        <ResponsiveContainer width="100%" height="100%">
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
                                    tickFormatter={(val) => `€${val}`}
                                    width={50}
                                />
                                <Tooltip
                                    formatter={(value) => formatEuro(value)}
                                    contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Bar dataKey={t.chartPlanned} fill="var(--accent-gold)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey={t.chartActual} fill="var(--accent-sage)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* EXPENSES TABLE */}
            <div className="glass-panel fade-in delay-3">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.4rem' }}>{t.tableTitle}</h2>
                    <button onClick={addExpense} className="outline hide-print">{t.tableAddBtn}</button>
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
                                        <div onClick={() => togglePaid(exp.id)} style={{ cursor: 'pointer', display: 'inline-block' }} title={exp.paid ? t.statusMarkUnpaid : t.statusMarkPaid}>
                                            {exp.paid ? <CheckCircle color="var(--success)" /> : <Clock color="var(--text-muted)" />}
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{exp.paid ? t.statusPaid : t.statusOpen}</div>
                                        </div>
                                    </td>

                                    {/* Position Details */}
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <select
                                                value={exp.category}
                                                onChange={(e) => handleExpenseChange(exp.id, 'category', e.target.value)}
                                                className="category-select"
                                                style={{ background: 'transparent', border: 'none', padding: 0, fontWeight: 600, color: 'var(--accent-gold)', width: '100%', cursor: 'pointer', appearance: 'none', outline: 'none' }}
                                            >
                                                {!EXPENSE_CATEGORIES.includes(exp.category) && (
                                                    <option value={exp.category}>{exp.category}</option>
                                                )}
                                                {EXPENSE_CATEGORIES.map((cat, i) => (
                                                    <option key={cat} value={cat}>{t.categories[i] || cat}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={exp.item}
                                                placeholder={t.inputDetails}
                                                onChange={(e) => handleExpenseChange(exp.id, 'item', e.target.value)}
                                                style={{ background: 'transparent', border: 'none', padding: 0, fontSize: '0.9rem' }}
                                            />
                                        </div>
                                    </td>

                                    {/* Comment */}
                                    <td className="editable-cell">
                                        <textarea
                                            placeholder={t.inputNotes}
                                            value={exp.comment || ''}
                                            onChange={(e) => handleExpenseChange(exp.id, 'comment', e.target.value)}
                                        />
                                    </td>

                                    {/* Factor (Per Person) */}
                                    <td className="editable-cell">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={exp.isPerPerson || false}
                                                onChange={() => togglePerPerson(exp.id)}
                                                id={`cb-${exp.id}`}
                                                style={{ width: 'auto' }}
                                            />
                                            <label htmlFor={`cb-${exp.id}`} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>{t.checkboxGuests}</label>
                                        </div>
                                        {exp.isPerPerson && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>€</span>
                                                <input
                                                    type="number"
                                                    className="number-input"
                                                    value={exp.costPerPerson}
                                                    title={t.perPerson}
                                                    onChange={(e) => handleExpenseChange(exp.id, 'costPerPerson', Number(e.target.value))}
                                                />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.perPerson}</span>
                                            </div>
                                        )}
                                    </td>

                                    {/* Estimated */}
                                    <td className="editable-cell">
                                        <input
                                            type="number"
                                            className="number-input"
                                            value={exp.estimated}
                                            onChange={(e) => handleExpenseChange(exp.id, 'estimated', Number(e.target.value))}
                                        />
                                        {exp.isPerPerson && (
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
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
                                            onChange={(e) => handleExpenseChange(exp.id, 'actual', Number(e.target.value))}
                                        />
                                    </td>

                                    {/* Actions */}
                                    <td className="hide-print" style={{ textAlign: 'center' }}>
                                        <button className="text-btn" onClick={() => removeExpense(exp.id)} title={t.deleteRow}>
                                            <Trash2 size={18} />
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
