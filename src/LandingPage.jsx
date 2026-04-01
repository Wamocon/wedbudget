import React, { useRef, useState, useEffect } from 'react';
import { Calculator, ArrowRight, ShieldCheck, PieChart, Heart, Upload, Play, RefreshCw, FileText } from 'lucide-react';
import { loadFromLocal, parseImportedJson } from './storage';
import { useLanguage } from './LanguageContext';

export default function LandingPage({ onStart }) {
    const fileInputRef = useRef(null);
    const [hasLocalData, setHasLocalData] = useState(false);
    const { lang, switchLang, t } = useLanguage();

    useEffect(() => {
        // Check if there is data from a previous session in the browser
        if (loadFromLocal()) {
            setHasLocalData(true);
        }
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = parseImportedJson(event.target.result);
                onStart('import', data);
            } catch (err) {
                alert(t.importError);
            }
        };
        reader.readAsText(file);
        // Reset inputs
        e.target.value = null;
    };

    return (
        <div className="landing-page fade-in">
            <nav className="navbar">
                <div className="nav-brand">
                    <Heart size={24} color="var(--accent-gold)" />
                    <span>{t.navBrand}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Language switcher */}
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
                    <button onClick={() => onStart('new')} className="outline login-btn" style={{ padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.9rem' }}>
                        {t.navCta}
                    </button>
                </div>
            </nav>

            <header className="hero-section fade-in delay-1">
                <div className="hero-badge">{t.heroBadge}</div>
                <h1 className="hero-title">
                    {t.heroTitle1}<br />
                    {t.heroTitle2}<br />
                    <span style={{ color: 'var(--accent-gold)' }}>{t.heroTitle3}</span>
                </h1>
                <p className="hero-subtitle">
                    {t.heroSubtitle}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {hasLocalData && (
                        <button onClick={() => onStart('continue')} className="cta-button pulse" style={{ background: 'var(--success)', color: '#fff' }}>
                            <Play size={20} /> {t.ctaContinue}
                        </button>
                    )}
                    <button onClick={() => onStart('new')} className={`cta-button ${!hasLocalData ? 'main-cta pulse' : 'outline'}`}>
                        <Calculator size={20} /> {hasLocalData ? t.ctaNew : t.ctaNewFirst}
                    </button>
                    <button onClick={() => fileInputRef.current.click()} className="cta-button outline">
                        <Upload size={20} /> {t.ctaImport}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </div>

                <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.heroDisclaimer}</p>
            </header>

            <section className="features-section fade-in delay-2">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Calculator size={32} />
                        </div>
                        <h3 className="feature-title">{t.feature1Title}</h3>
                        <p className="feature-text">
                            {t.feature1Text}
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <RefreshCw size={32} />
                        </div>
                        <h3 className="feature-title">{t.feature2Title}</h3>
                        <p className="feature-text">
                            {t.feature2Text}
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="feature-title">{t.feature3Title}</h3>
                        <p className="feature-text">
                            {t.feature3Text}
                        </p>
                    </div>
                </div>
            </section>

            <footer className="footer-section filter opacity-50 text-center py-5">
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '2rem' }}>
                    {t.footerText.replace('{year}', new Date().getFullYear())}
                </p>
            </footer>
        </div>
    );
}
