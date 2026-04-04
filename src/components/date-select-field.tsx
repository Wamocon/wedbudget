'use client';

import { useEffect, useMemo, useState } from 'react';

export type DateFieldPlaceholder = {
  day: string;
  month: string;
  year: string;
};

type DatePartsDraft = {
  day: string;
  month: string;
  year: string;
};

type DateSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  minYear?: number;
  maxYear?: number;
  placeholder: DateFieldPlaceholder;
};

export const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export const parseIsoDateParts = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > getDaysInMonth(year, month)) return null;

  return { year, month, day };
};

const formatIsoDate = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const toDraft = (value: string, minYear: number, maxYear: number): DatePartsDraft => {
  const parsedDate = parseIsoDateParts(value);
  if (!parsedDate) {
    return { day: '', month: '', year: '' };
  }

  if (parsedDate.year < minYear || parsedDate.year > maxYear) {
    return { day: '', month: '', year: '' };
  }

  return {
    day: String(parsedDate.day),
    month: String(parsedDate.month),
    year: String(parsedDate.year),
  };
};

export default function DateSelectField({
  value,
  onChange,
  minYear = new Date().getFullYear() - 5,
  maxYear = new Date().getFullYear() + 10,
  placeholder,
}: DateSelectFieldProps) {
  const [draft, setDraft] = useState<DatePartsDraft>(() => toDraft(value, minYear, maxYear));

  useEffect(() => {
    setDraft(toDraft(value, minYear, maxYear));
  }, [value, minYear, maxYear]);

  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, index) => String(minYear + index)),
    [maxYear, minYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, index) => String(index + 1)), []);

  const maxDays = draft.year && draft.month
    ? getDaysInMonth(Number(draft.year), Number(draft.month))
    : 31;
  const days = useMemo(() => Array.from({ length: maxDays }, (_, index) => String(index + 1)), [maxDays]);

  const applyDraft = (nextDraft: DatePartsDraft) => {
    const year = Number(nextDraft.year);
    const month = Number(nextDraft.month);

    if (
      nextDraft.year &&
      nextDraft.month &&
      nextDraft.day &&
      Number.isInteger(year) &&
      Number.isInteger(month) &&
      year >= minYear &&
      year <= maxYear &&
      month >= 1 &&
      month <= 12
    ) {
      const safeDay = Math.min(Number(nextDraft.day), getDaysInMonth(year, month));
      const normalizedDraft = { ...nextDraft, day: String(safeDay) };
      setDraft(normalizedDraft);
      onChange(formatIsoDate(year, month, safeDay));
      return;
    }

    setDraft(nextDraft);
    onChange('');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(84px, 1fr) minmax(84px, 1fr) minmax(96px, 1fr)', gap: '0.5rem' }}>
      <select value={draft.day} onChange={(e) => applyDraft({ ...draft, day: e.target.value })}>
        <option value="">{placeholder.day}</option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
      <select value={draft.month} onChange={(e) => applyDraft({ ...draft, month: e.target.value })}>
        <option value="">{placeholder.month}</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select value={draft.year} onChange={(e) => applyDraft({ ...draft, year: e.target.value })}>
        <option value="">{placeholder.year}</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}