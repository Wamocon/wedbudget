'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  MapPinned,
  Shirt,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import DateSelectField from '@/components/date-select-field';
import { useLanguage } from '@/context/language-context';
import type { Expense, PlanningData } from '@/lib/types';

interface OnboardingSurveyProps {
  initialData: PlanningData;
  onBack: () => void;
  onComplete: (data: PlanningData) => void;
}

type ServiceKey = 'location' | 'catering' | 'invitations' | 'decoration';
type SimpleKey = 'dress' | 'suit' | 'rings';
type ProviderKey = 'moderator' | 'dj' | 'photographer' | 'videographer';
type BasicKey = 'weddingName' | 'weddingDate' | 'guestCount' | 'totalBudget';

type OnboardingStep =
  | {
      key: BasicKey;
      kind: 'basic';
      title: string;
      description: string;
      label: string;
      inputType: 'text' | 'date' | 'number';
      icon: LucideIcon;
    }
  | {
      key: ServiceKey;
      kind: 'service';
      title: string;
      description: string;
      icon: LucideIcon;
    }
  | {
      key: SimpleKey;
      kind: 'simple';
      title: string;
      description: string;
      icon: LucideIcon;
    }
  | {
      key: 'providers';
      kind: 'multi';
      title: string;
      description: string;
      icon: LucideIcon;
    };

interface ServiceAnswer {
  enabled: boolean | null;
  amount: string;
  perPerson: boolean;
}

interface SimpleAnswer {
  enabled: boolean | null;
  amount: string;
}

interface AnswersState {
  location: ServiceAnswer;
  catering: ServiceAnswer;
  invitations: ServiceAnswer;
  decoration: ServiceAnswer;
  dress: SimpleAnswer;
  suit: SimpleAnswer;
  rings: SimpleAnswer;
  providers: ProviderKey[];
}

const createServiceAnswer = (): ServiceAnswer => ({ enabled: null, amount: '', perPerson: false });
const createSimpleAnswer = (): SimpleAnswer => ({ enabled: null, amount: '' });
const MAX_WEDDING_NAME_LENGTH = 50;
const MAX_GUEST_COUNT = 999;
const MAX_MONEY_AMOUNT = 9999999;
const CURRENT_YEAR = new Date().getFullYear();
const MIN_WEDDING_YEAR = CURRENT_YEAR - 1;
const MAX_WEDDING_YEAR = CURRENT_YEAR + 10;

const clampInt = (value: number, min: number, max: number) => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
};

const createExpense = (input: {
  category: string;
  item: string;
  amount?: number;
  isPerPerson?: boolean;
  costPerPerson?: number;
}): Expense => ({
  id: `exp-${Math.random().toString(36).slice(2, 10)}`,
  category: input.category,
  item: input.item,
  targetDate: '',
  estimated: input.amount ?? 0,
  actual: 0,
  status: 'open',
  isPerPerson: input.isPerPerson ?? false,
  costPerPerson: input.isPerPerson ? input.costPerPerson ?? input.amount ?? 0 : 0,
  attachments: [],
  updates: [],
  checklist: [],
});

export default function OnboardingSurvey({ initialData, onBack, onComplete }: OnboardingSurveyProps) {
  const { lang, t } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const [basics, setBasics] = useState<Record<BasicKey, string>>({
    weddingName: (initialData.weddingName || '').slice(0, MAX_WEDDING_NAME_LENGTH),
    weddingDate: initialData.weddingDate || '',
    guestCount: String(clampInt(initialData.guestCount, 1, MAX_GUEST_COUNT)),
    totalBudget: String(clampInt(initialData.totalBudget, 1, MAX_MONEY_AMOUNT)),
  });
  const [answers, setAnswers] = useState<AnswersState>({
    location: createServiceAnswer(),
    catering: createServiceAnswer(),
    invitations: createServiceAnswer(),
    decoration: createServiceAnswer(),
    dress: createSimpleAnswer(),
    suit: createSimpleAnswer(),
    rings: createSimpleAnswer(),
    providers: [],
  });

  const providerOptions = useMemo(
    () => [
      { key: 'moderator' as const, label: t.onboardingModerator },
      { key: 'dj' as const, label: t.onboardingDj },
      { key: 'photographer' as const, label: t.onboardingPhotographer },
      { key: 'videographer' as const, label: t.onboardingVideographer },
    ],
    [t],
  );

  const steps = useMemo<OnboardingStep[]>(
    () => [
      {
        key: 'weddingName',
        kind: 'basic',
        title: t.onboardingBasicsNameTitle,
        description: t.onboardingBasicsNameDescription,
        label: t.onboardingBasicsNameLabel,
        inputType: 'text',
        icon: Wallet,
      },
      {
        key: 'weddingDate',
        kind: 'basic',
        title: t.onboardingBasicsDateTitle,
        description: t.onboardingBasicsDateDescription,
        label: t.onboardingBasicsDateLabel,
        inputType: 'date',
        icon: CalendarDays,
      },
      {
        key: 'guestCount',
        kind: 'basic',
        title: t.onboardingBasicsGuestsTitle,
        description: t.onboardingBasicsGuestsDescription,
        label: t.onboardingBasicsGuestsLabel,
        inputType: 'number',
        icon: Users,
      },
      {
        key: 'totalBudget',
        kind: 'basic',
        title: t.onboardingBasicsBudgetTitle,
        description: t.onboardingBasicsBudgetDescription,
        label: t.onboardingBasicsBudgetLabel,
        inputType: 'number',
        icon: CircleDollarSign,
      },
      {
        key: 'location',
        kind: 'service',
        title: t.onboardingLocationTitle,
        description: t.onboardingLocationDescription,
        icon: MapPinned,
      },
      {
        key: 'catering',
        kind: 'service',
        title: t.onboardingCateringTitle,
        description: t.onboardingCateringDescription,
        icon: CircleDollarSign,
      },
      {
        key: 'invitations',
        kind: 'service',
        title: t.onboardingInvitationsTitle,
        description: t.onboardingInvitationsDescription,
        icon: CheckSquare,
      },
      {
        key: 'decoration',
        kind: 'service',
        title: t.onboardingDecorationTitle,
        description: t.onboardingDecorationDescription,
        icon: Sparkles,
      },
      {
        key: 'dress',
        kind: 'simple',
        title: t.onboardingDressTitle,
        description: t.onboardingDressDescription,
        icon: Shirt,
      },
      {
        key: 'suit',
        kind: 'simple',
        title: t.onboardingSuitTitle,
        description: t.onboardingSuitDescription,
        icon: Shirt,
      },
      {
        key: 'providers',
        kind: 'multi',
        title: t.onboardingServicesTitle,
        description: t.onboardingServicesDescription,
        icon: CheckSquare,
      },
      {
        key: 'rings',
        kind: 'simple',
        title: t.onboardingRingsTitle,
        description: t.onboardingRingsDescription,
        icon: CircleDollarSign,
      },
    ],
    [t],
  );

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  const setServiceAnswer = (key: ServiceKey, update: Partial<ServiceAnswer>) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...update,
      },
    }));
    setError('');
  };

  const setSimpleAnswer = (key: SimpleKey, update: Partial<SimpleAnswer>) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...update,
      },
    }));
    setError('');
  };

  const toggleProvider = (key: ProviderKey) => {
    setAnswers((prev) => ({
      ...prev,
      providers: prev.providers.includes(key)
        ? prev.providers.filter((entry) => entry !== key)
        : [...prev.providers, key],
    }));
    setError('');
  };

  const parseAmount = (value: string): number | null => {
    if (value.trim().length === 0) return null;
    const normalized = Number(value.replace(',', '.'));
    if (!Number.isFinite(normalized) || normalized < 0) return null;
    return clampInt(normalized, 0, MAX_MONEY_AMOUNT);
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep.kind === 'basic') {
      if (currentStep.key === 'weddingName' && basics.weddingName.trim().length === 0) {
        setError(t.onboardingValidationName);
        return false;
      }

      if (currentStep.key === 'guestCount') {
        const guests = Number(basics.guestCount);
        if (!Number.isFinite(guests) || guests < 1) {
          setError(t.onboardingValidationGuests);
          return false;
        }
      }

      if (currentStep.key === 'totalBudget') {
        const budget = Number(basics.totalBudget);
        if (!Number.isFinite(budget) || budget < 1) {
          setError(t.onboardingValidationBudget);
          return false;
        }
      }

      return true;
    }

    if (currentStep.kind === 'service') {
      const answer = answers[currentStep.key];
      if (answer.enabled === null) {
        setError(t.onboardingValidationYesNo);
        return false;
      }
      if (answer.enabled && parseAmount(answer.amount) === null) {
        setError(t.onboardingValidationAmount);
        return false;
      }
      return true;
    }

    if (currentStep.kind === 'simple') {
      const answer = answers[currentStep.key];
      if (answer.enabled === null) {
        setError(t.onboardingValidationYesNo);
        return false;
      }
      if (answer.enabled && parseAmount(answer.amount) === null) {
        setError(t.onboardingValidationAmount);
        return false;
      }
      return true;
    }

    return true;
  };

  const buildExpenses = (): Expense[] => {
    const result: Expense[] = [];
    const guestCount = clampInt(Number(basics.guestCount), 1, MAX_GUEST_COUNT);

    const serviceDefinitions: Array<{
      key: ServiceKey;
      category: string;
      item: string;
    }> = [
      {
        key: 'location',
        category: 'Location',
        item: lang === 'de' ? 'Location' : 'Venue',
      },
      {
        key: 'catering',
        category: 'Catering',
        item: lang === 'de' ? 'Catering' : 'Catering',
      },
      {
        key: 'invitations',
        category: 'Einladungen',
        item: lang === 'de' ? 'Einladungen & Papeterie' : 'Invitations & stationery',
      },
      {
        key: 'decoration',
        category: 'Dekoration',
        item: lang === 'de' ? 'Dekoration' : 'Decoration',
      },
    ];

    serviceDefinitions.forEach((definition) => {
      const answer = answers[definition.key];
      if (!answer.enabled) return;
      const amount = parseAmount(answer.amount) ?? 0;
      const estimated = answer.perPerson
        ? clampInt(amount * guestCount, 0, MAX_MONEY_AMOUNT)
        : clampInt(amount, 0, MAX_MONEY_AMOUNT);
      result.push(
        createExpense({
          category: definition.category,
          item: definition.item,
          amount: estimated,
          isPerPerson: answer.perPerson,
          costPerPerson: answer.perPerson ? clampInt(amount, 0, MAX_MONEY_AMOUNT) : 0,
        }),
      );
    });

    const simpleDefinitions: Array<{
      key: SimpleKey;
      category: string;
      item: string;
    }> = [
      {
        key: 'dress',
        category: 'Kleidung',
        item: lang === 'de' ? 'Brautkleid' : 'Wedding dress',
      },
      {
        key: 'suit',
        category: 'Kleidung',
        item: lang === 'de' ? 'Anzug' : 'Suit',
      },
      {
        key: 'rings',
        category: 'Ringe',
        item: lang === 'de' ? 'Ringe' : 'Rings',
      },
    ];

    simpleDefinitions.forEach((definition) => {
      const answer = answers[definition.key];
      if (!answer.enabled) return;
      result.push(
        createExpense({
          category: definition.category,
          item: definition.item,
          amount: parseAmount(answer.amount) ?? 0,
        }),
      );
    });

    const providerDefinitions: Record<ProviderKey, { category: string; item: string }> = {
      moderator: {
        category: 'Musik & Entertainment',
        item: lang === 'de' ? 'Moderator' : 'Host',
      },
      dj: {
        category: 'Musik & Entertainment',
        item: 'DJ',
      },
      photographer: {
        category: 'Fotografie',
        item: lang === 'de' ? 'Fotograf' : 'Photographer',
      },
      videographer: {
        category: 'Fotografie',
        item: lang === 'de' ? 'Videograf' : 'Videographer',
      },
    };

    answers.providers.forEach((providerKey) => {
      const definition = providerDefinitions[providerKey];
      result.push(createExpense(definition));
    });

    return result;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      const nextWeddingName = basics.weddingName.trim().slice(0, MAX_WEDDING_NAME_LENGTH);
      const nextGuestCount = clampInt(Number(basics.guestCount), 1, MAX_GUEST_COUNT);
      const nextTotalBudget = clampInt(Number(basics.totalBudget), 1, MAX_MONEY_AMOUNT);
      onComplete({
        ...initialData,
        weddingName: nextWeddingName.length > 0
          ? nextWeddingName
          : lang === 'de'
            ? 'Unsere Hochzeit'
            : 'Our Wedding',
        weddingDate: basics.weddingDate || '',
        guestCount: nextGuestCount,
        totalBudget: nextTotalBudget,
        expenses: buildExpenses(),
      });
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const icon = <currentStep.icon size={22} />;

  return (
    <div className="landing-page" style={{ minHeight: '100vh', padding: 'clamp(1rem, 3vw, 2rem)' }}>
      <div
        className="glass-panel fade-in"
        style={{
          width: 'min(780px, 100%)',
          margin: '0 auto',
          padding: 'clamp(1.25rem, 3vw, 2rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="outline" onClick={onBack} style={{ padding: '0.55rem 0.9rem' }}>
            <ArrowLeft size={16} /> {t.onboardingBackHome}
          </button>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {t.onboardingProgress(stepIndex + 1, steps.length)}
          </div>
        </div>

        <div>
          <h1 style={{ marginBottom: '0.45rem' }}>{t.onboardingTitle}</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 620 }}>{t.onboardingSubtitle}</p>
        </div>

        <div
          style={{
            height: 8,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${((stepIndex + 1) / steps.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-sage))',
            }}
          />
        </div>

        <div
          className="glass-panel"
          style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(184, 137, 78, 0.14)',
                color: 'var(--accent-gold)',
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div>
              <h2 style={{ marginBottom: '0.2rem' }}>{currentStep.title}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{currentStep.description}</p>
            </div>
          </div>

          {(currentStep.kind === 'service' || currentStep.kind === 'simple') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className={answers[currentStep.key].enabled === true ? '' : 'outline'}
                  onClick={() =>
                    currentStep.kind === 'service'
                      ? setServiceAnswer(currentStep.key, { enabled: true })
                      : setSimpleAnswer(currentStep.key, { enabled: true })
                  }
                  style={{ minWidth: 120 }}
                >
                  {t.onboardingAnswerYes}
                </button>
                <button
                  className={answers[currentStep.key].enabled === false ? '' : 'outline'}
                  onClick={() =>
                    currentStep.kind === 'service'
                      ? setServiceAnswer(currentStep.key, { enabled: false, amount: '', perPerson: false })
                      : setSimpleAnswer(currentStep.key, { enabled: false, amount: '' })
                  }
                  style={{ minWidth: 120 }}
                >
                  {t.onboardingAnswerNo}
                </button>
              </div>

              {answers[currentStep.key].enabled && (
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>{t.onboardingBudgetLabel}</label>
                    <input
                      type="number"
                      min={0}
                      max={MAX_MONEY_AMOUNT}
                      step="50"
                      value={answers[currentStep.key].amount}
                      onChange={(e) =>
                        {
                          const rawValue = e.target.value;
                          if (rawValue === '') {
                            if (currentStep.kind === 'service') {
                              setServiceAnswer(currentStep.key, { amount: '' });
                            } else {
                              setSimpleAnswer(currentStep.key, { amount: '' });
                            }
                            return;
                          }

                          const numericValue = Number(rawValue);
                          const nextValue = Number.isFinite(numericValue)
                            ? String(clampInt(numericValue, 0, MAX_MONEY_AMOUNT))
                            : '0';

                          if (currentStep.kind === 'service') {
                            setServiceAnswer(currentStep.key, { amount: nextValue });
                          } else {
                            setSimpleAnswer(currentStep.key, { amount: nextValue });
                          }
                        }
                      }
                    />
                  </div>

                  {currentStep.kind === 'service' && (
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={answers[currentStep.key].perPerson}
                        onChange={(e) => setServiceAnswer(currentStep.key, { perPerson: e.target.checked })}
                        style={{ width: 'auto' }}
                      />
                      {t.onboardingPerPersonLabel}
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep.kind === 'basic' && (
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>{currentStep.label}</label>
                {currentStep.key === 'weddingDate' ? (
                  <DateSelectField
                    value={basics.weddingDate}
                    onChange={(value) => {
                      setBasics((prev) => ({ ...prev, weddingDate: value }));
                      setError('');
                    }}
                    minYear={MIN_WEDDING_YEAR}
                    maxYear={MAX_WEDDING_YEAR}
                    placeholder={{
                      day: t.datePlaceholderDay,
                      month: t.datePlaceholderMonth,
                      year: t.datePlaceholderYear,
                    }}
                  />
                ) : (
                  <input
                    type={currentStep.inputType}
                    value={basics[currentStep.key]}
                    onChange={(e) => {
                      const nextValue = e.target.value;

                      if (currentStep.key === 'weddingName') {
                        setBasics((prev) => ({
                          ...prev,
                          weddingName: nextValue.slice(0, MAX_WEDDING_NAME_LENGTH),
                        }));
                        setError('');
                        return;
                      }

                      if (currentStep.key === 'guestCount') {
                        const value = Number(nextValue);
                        setBasics((prev) => ({
                          ...prev,
                          guestCount: Number.isFinite(value)
                            ? String(clampInt(value, 1, MAX_GUEST_COUNT))
                            : prev.guestCount,
                        }));
                        setError('');
                        return;
                      }

                      if (currentStep.key === 'totalBudget') {
                        const value = Number(nextValue);
                        setBasics((prev) => ({
                          ...prev,
                          totalBudget: Number.isFinite(value)
                            ? String(clampInt(value, 1, MAX_MONEY_AMOUNT))
                            : prev.totalBudget,
                        }));
                        setError('');
                      }
                    }}
                    min={currentStep.key === 'guestCount' || currentStep.key === 'totalBudget' ? 1 : undefined}
                    max={currentStep.key === 'guestCount' ? MAX_GUEST_COUNT : currentStep.key === 'totalBudget' ? MAX_MONEY_AMOUNT : undefined}
                    step={currentStep.key === 'totalBudget' ? 500 : currentStep.key === 'guestCount' ? 1 : undefined}
                  />
                )}
              </div>
            </div>
          )}

          {currentStep.kind === 'multi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>{t.onboardingPlannedServicesLabel}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {providerOptions.map((option) => {
                  const selected = answers.providers.includes(option.key);
                  return (
                    <button
                      key={option.key}
                      className={selected ? '' : 'outline'}
                      onClick={() => toggleProvider(option.key)}
                      style={{ justifyContent: 'space-between', padding: '0.8rem 1rem' }}
                    >
                      <span>{option.label}</span>
                      <span style={{ color: selected ? 'inherit' : 'var(--text-muted)' }}>
                        {selected ? '✓' : '+'}
                      </span>
                    </button>
                  );
                })}
              </div>
              {answers.providers.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t.onboardingNoBudgetYet}</div>
              )}
            </div>
          )}

          {error && <div style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>{error}</div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ color: 'var(--text-muted)', maxWidth: 520 }}>{t.onboardingSkipHint}</div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="outline"
              onClick={() => {
                setError('');
                setStepIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={stepIndex === 0}
              style={{ opacity: stepIndex === 0 ? 0.5 : 1 }}
            >
              {t.onboardingBackQuestion}
            </button>
            <button onClick={handleNext}>{isLastStep ? t.onboardingFinish : t.onboardingNext}</button>
          </div>
        </div>
      </div>
    </div>
  );
}