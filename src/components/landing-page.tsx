'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Upload, ArrowRight, Lock, RefreshCw, BarChart2, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import { clearLocalData, exportToJson, loadFromLocal, parseImportedJson, saveToLocal } from '@/lib/storage';

export default function LandingPage() {
  const router = useRouter();
  const { lang, switchLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [hasLocalData, setHasLocalData] = useState(false);
  const [importError, setImportError] = useState('');
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadFromLocal();
    setHasLocalData(!!saved);
  }, []);

  const handleContinue = () => {
    router.push('/plan?mode=dashboard');
  };

  const handleNew = () => {
    if (hasLocalData) {
      setShowOverwriteModal(true);
      return;
    }
    router.push('/plan?fresh=1');
  };

  const handleExportExistingData = async () => {
    const existing = loadFromLocal();
    if (!existing) return;
    const { version, ...withoutVersion } = existing;
    void version;
    await exportToJson(withoutVersion);
  };

  const handleOverwriteConfirmed = () => {
    clearLocalData();
    setHasLocalData(false);
    setShowOverwriteModal(false);
    router.push('/plan?fresh=1');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const result = ev.target?.result;
        if (typeof result !== 'string') throw new Error('Invalid file');
        const data = parseImportedJson(result);
        const { version, ...withoutVersion } = data;
        void version;
        saveToLocal(withoutVersion);
        setHasLocalData(true);
        router.push('/plan?mode=dashboard');
      } catch {
        setImportError(t.importError);
        setTimeout(() => setImportError(''), 4000);
      }
    };
    reader.readAsText(file);
    // reset so user can re-import same file
    e.target.value = '';
  };

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-brand">
          <Heart size={24} />
          {t.navBrand}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="theme-switch"
            onClick={toggleTheme}
            title={lang === 'de' ? 'Farbmodus wechseln' : 'Toggle theme'}
            suppressHydrationWarning
          >
            <span className="theme-switch__thumb">
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </span>
          </button>
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => switchLang(e.target.value)}
            aria-label={lang === 'de' ? 'Sprache auswählen' : 'Select language'}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
          <button className="outline" onClick={handleNew} style={{ borderRadius: '30px' }}>
            {t.navCta}
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-badge fade-in">{t.heroBadge}</div>

        <h1 className="hero-title fade-in delay-1">
          <span style={{ color: 'var(--accent-gold)' }}>{t.heroTitle1}</span>
          <br />
          {t.heroTitle2}
          <br />
          {t.heroTitle3}
        </h1>

        <p className="hero-subtitle fade-in delay-2">{t.heroSubtitle}</p>

        <div className="cta-group fade-in delay-3">
          {hasLocalData ? (
            <button className="cta-button pulse" onClick={handleContinue}>
              <RefreshCw size={20} />
              {t.ctaContinue}
            </button>
          ) : null}

          <button
            className={`cta-button ${hasLocalData ? 'outline' : 'pulse'}`}
            onClick={handleNew}
          >
            <ArrowRight size={20} />
            {hasLocalData ? t.ctaNew : t.ctaNewFirst}
          </button>

          <button className="outline cta-button" onClick={handleImportClick}>
            <Upload size={20} />
            {t.ctaImport}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {importError && (
            <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{importError}</p>
          )}
        </div>

        <p className="hero-disclaimer">
          <Lock size={14} />
          {t.heroDisclaimer}
        </p>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card fade-in">
            <div className="feature-icon">
              <BarChart2 size={28} />
            </div>
            <h3 className="feature-title">{t.feature1Title}</h3>
            <p className="feature-text">{t.feature1Text}</p>
          </div>
          <div className="feature-card fade-in delay-1">
            <div className="feature-icon">
              <RefreshCw size={28} />
            </div>
            <h3 className="feature-title">{t.feature2Title}</h3>
            <p className="feature-text">{t.feature2Text}</p>
          </div>
          <div className="feature-card fade-in delay-2">
            <div className="feature-icon">
              <Lock size={28} />
            </div>
            <h3 className="feature-title">{t.feature3Title}</h3>
            <p className="feature-text">{t.feature3Text}</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        {t.footerText.replace('{year}', String(new Date().getFullYear()))}
      </footer>

      {showOverwriteModal && (
        <div
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
          <div className="glass-panel" style={{ width: 'min(760px, 100%)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>
              {lang === 'de' ? 'Bestehende Planung gefunden' : 'Existing plan found'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {lang === 'de'
                ? 'Es gibt bereits Daten im Browser-Cache. Du kannst diese zuerst exportieren oder die Daten für ein neues Projekt überschreiben.'
                : 'There is already data in browser cache. You can export it first or overwrite it to start a new project.'}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '0.6rem',
                alignItems: 'stretch',
              }}
            >
              <button
                className="outline"
                onClick={() => setShowOverwriteModal(false)}
                style={{ whiteSpace: 'nowrap' }}
              >
                {lang === 'de' ? 'Abbrechen' : 'Cancel'}
              </button>
              <button className="outline" onClick={handleExportExistingData} style={{ whiteSpace: 'nowrap' }}>
                {lang === 'de' ? 'Daten exportieren' : 'Export data'}
              </button>
              <button onClick={handleOverwriteConfirmed} style={{ whiteSpace: 'nowrap' }}>
                {lang === 'de' ? 'Überschreiben und neu starten' : 'Overwrite and start new'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
