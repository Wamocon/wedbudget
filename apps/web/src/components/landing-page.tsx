'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, Upload, ArrowRight, Lock, RefreshCw, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { loadFromLocal, parseImportedJson } from '@/lib/storage';
import type { PlanningData } from '@/lib/types';

interface LandingPageProps {
  onStart: (data?: PlanningData) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const { lang, switchLang, t } = useLanguage();
  const [hasLocalData, setHasLocalData] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = loadFromLocal();
    setHasLocalData(!!saved);
  }, []);

  const handleContinue = () => {
    const saved = loadFromLocal();
    onStart(saved ?? undefined);
  };

  const handleNew = () => {
    onStart(undefined);
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
        onStart(data);
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
          <div className="lang-switcher">
            <button
              className={`lang-btn ${lang === 'de' ? 'lang-btn--active' : ''}`}
              onClick={() => switchLang('de')}
            >
              🇩🇪 DE
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`}
              onClick={() => switchLang('en')}
            >
              🇬🇧 EN
            </button>
          </div>
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
    </div>
  );
}
