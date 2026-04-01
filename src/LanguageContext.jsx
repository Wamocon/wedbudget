import React, { createContext, useContext, useState } from 'react';

const translations = {
    de: {
        // LandingPage
        navBrand: 'WedBudget',
        navCta: 'Direkt loslegen',
        heroBadge: 'Das 100% kostenlose Community-Tool',
        heroTitle1: 'Eure Traumhochzeit.',
        heroTitle2: 'Entspannt geplant.',
        heroTitle3: 'Ohne Excel-Chaos.',
        heroSubtitle:
            'Behaltet die volle Kontrolle über eure Hochzeitsfinanzen. Dieses Tool hilft euch dabei, Kosten richtig einzuschätzen und euer Budget im Blick zu behalten – komplett kostenfrei, werbefrei und ohne versteckte Bedingungen.',
        ctaContinue: 'Letzte Planung fortsetzen',
        ctaNew: 'Neue Planung starten',
        ctaNewFirst: 'Jetzt Budget berechnen',
        ctaImport: 'Backup Datei laden (.json)',
        heroDisclaimer: 'Kein Login. Keine Datenspeicherung. Eure Daten bleiben im Browser.',
        feature1Title: 'Realistische Schätzungen',
        feature1Text:
            'Gebt einfach Gästezahl und Region ein. Unser Rechner gibt euch direkt eine grobe Orientierung für Location und Catering, damit ihr realistisch planen könnt.',
        feature2Title: 'Automatische Speicherung',
        feature2Text:
            'Dieses Tool speichert alles lokal in eurem Browser. Verlasst die Seite sorgenfrei - ihr macht beim nächsten Öffnen genau da weiter, wo ihr aufgehört habt.',
        feature3Title: 'Volle Privatsphäre',
        feature3Text:
            'Wir speichern nichts auf unseren Servern. Ladet ein gesichertes JSON-Backup herunter oder generiert temporäre Links, um alles bequem mit dem Partner zu teilen.',
        footerText: '© {year} WedBudget. Ein kostenfreies Tool zur Hochzeitsplanung. Viel Freude bei den Vorbereitungen!',
        importError: 'Fehler beim Lesen der Datei. Ist es ein gültiges Hochzeitsrechner-Backup?',

        // Calculator – header
        calcBack: 'Zurück',
        calcFileBtn: 'Datei',
        calcFileTip: 'Datei lokal per JSON sichern',
        calcLinkBtn: 'Link',
        calcLinkTip: 'Daten in URL-Link verpacken zum Teilen',
        calcLinkCopied: 'Kopiert!',
        calcPdfBtn: 'PDF',
        calcPdfTip: 'Tabelle als PDF Dokument drucken',
        calcTitle: 'Hochzeits-Budgetplaner',
        calcSubtitle: 'Ein kostenfreies Helferlein für eure sorgenfreie Planung',

        // Calculator – setup panel
        setupTitle: 'Event Eckdaten',
        setupGuests: 'Gästeanzahl',
        setupRegion: 'Region',
        setupBudget: 'Gesamtbudget (€)',
        setupHint: (region) =>
            `<strong>KI-Heuristik aktiv:</strong> Kosten für Posten, die sich nach Gästen richten (siehe Tabelle), werden bei Änderung der Gästezahl automatisch auf Basis des Regionalfaktors (${region}) angepasst.`,

        // Calculator – stats
        statPlanned: 'Geplant',
        statActual: 'Tatsächlich',
        statBuffer: 'Puffer',
        chartTitle: 'Soll-Ist Vergleich nach Kategorie',
        chartPlanned: 'Geplant',
        chartActual: 'Tatsächlich',

        // Calculator – expenses table
        tableTitle: 'Voranschlag & Ausgaben',
        tableAddBtn: 'Position hinzufügen',
        colStatus: 'Status',
        colPosition: 'Position',
        colComment: 'Kommentar',
        colFactor: 'Faktor (p.P.)',
        colPlanned: 'Geplant (€)',
        colActual: 'Tatsächlich (€)',
        statusPaid: 'Bezahlt',
        statusOpen: 'Offen',
        statusMarkPaid: 'Als bezahlt markieren',
        statusMarkUnpaid: 'Als unbezahlt markieren',
        checkboxGuests: 'Abhängig von Gäste',
        inputNotes: 'Notizen...',
        inputDetails: 'Details',
        autoCalc: 'Auto-berechnet',
        deleteRow: 'Position löschen',
        perPerson: 'p.P.',
        newExpenseItem: 'Neu',
        newExpenseCategory: 'Sonstiges',

        // Expense categories
        categories: [
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
        ],

        // Regions
        regions: {
            'Baden-Württemberg': 'Baden-Württemberg',
            Bayern: 'Bayern',
            Berlin: 'Berlin',
            Brandenburg: 'Brandenburg',
            Bremen: 'Bremen',
            Hamburg: 'Hamburg',
            Hessen: 'Hessen',
            'Mecklenburg-Vorpommern': 'Mecklenburg-Vorpommern',
            Niedersachsen: 'Niedersachsen',
            'Nordrhein-Westfalen': 'Nordrhein-Westfalen',
            'Rheinland-Pfalz': 'Rheinland-Pfalz',
            Saarland: 'Saarland',
            Sachsen: 'Sachsen',
            'Sachsen-Anhalt': 'Sachsen-Anhalt',
            'Schleswig-Holstein': 'Schleswig-Holstein',
            Thüringen: 'Thüringen',
            International: 'International',
        },
    },

    ru: {
        // LandingPage
        navBrand: 'WedBudget',
        navCta: 'Начать сейчас',
        heroBadge: '100% бесплатный инструмент сообщества',
        heroTitle1: 'Свадьба мечты.',
        heroTitle2: 'Спланировано легко.',
        heroTitle3: 'Без хаоса в Excel.',
        heroSubtitle:
            'Держите полный контроль над свадебным бюджетом. Этот инструмент поможет вам оценить расходы и не выйти за рамки бюджета — полностью бесплатно, без рекламы и скрытых условий.',
        ctaContinue: 'Продолжить планирование',
        ctaNew: 'Начать новое планирование',
        ctaNewFirst: 'Рассчитать бюджет',
        ctaImport: 'Загрузить резервную копию (.json)',
        heroDisclaimer: 'Без регистрации. Без хранения данных. Ваши данные остаются в браузере.',
        feature1Title: 'Реалистичные оценки',
        feature1Text:
            'Просто введите количество гостей и регион. Наш калькулятор сразу даст вам приблизительную ориентировку по площадке и кейтерингу для реалистичного планирования.',
        feature2Title: 'Автоматическое сохранение',
        feature2Text:
            'Инструмент сохраняет всё локально в браузере. Покидайте страницу без беспокойства — при следующем открытии вы продолжите с того же места.',
        feature3Title: 'Полная конфиденциальность',
        feature3Text:
            'Мы ничего не храним на наших серверах. Скачайте резервную копию в формате JSON или создайте временные ссылки, чтобы удобно поделиться с партнёром.',
        footerText: '© {year} WedBudget. Бесплатный инструмент для свадебного планирования. Желаем радостной подготовки!',
        importError: 'Ошибка чтения файла. Является ли это действительной резервной копией WedBudget?',

        // Calculator – header
        calcBack: 'Назад',
        calcFileBtn: 'Файл',
        calcFileTip: 'Сохранить файл локально в формате JSON',
        calcLinkBtn: 'Ссылка',
        calcLinkTip: 'Упаковать данные в URL для обмена',
        calcLinkCopied: 'Скопировано!',
        calcPdfBtn: 'PDF',
        calcPdfTip: 'Распечатать таблицу как PDF документ',
        calcTitle: 'Свадебный бюджет-планировщик',
        calcSubtitle: 'Бесплатный помощник для беззаботного планирования',

        // Calculator – setup panel
        setupTitle: 'Основные данные',
        setupGuests: 'Количество гостей',
        setupRegion: 'Регион',
        setupBudget: 'Общий бюджет (€)',
        setupHint: (region) =>
            `<strong>ИИ-эвристика активна:</strong> Расходы, зависящие от количества гостей (см. таблицу), автоматически пересчитываются при изменении числа гостей на основе регионального коэффициента (${region}).`,

        // Calculator – stats
        statPlanned: 'Запланировано',
        statActual: 'Фактически',
        statBuffer: 'Резерв',
        chartTitle: 'Сравнение план/факт по категории',
        chartPlanned: 'Запланировано',
        chartActual: 'Фактически',

        // Calculator – expenses table
        tableTitle: 'Смета и расходы',
        tableAddBtn: 'Добавить позицию',
        colStatus: 'Статус',
        colPosition: 'Позиция',
        colComment: 'Комментарий',
        colFactor: 'Фактор (на чел.)',
        colPlanned: 'Запланировано (€)',
        colActual: 'Фактически (€)',
        statusPaid: 'Оплачено',
        statusOpen: 'Ожидает',
        statusMarkPaid: 'Отметить как оплаченное',
        statusMarkUnpaid: 'Отметить как неоплаченное',
        checkboxGuests: 'Зависит от гостей',
        inputNotes: 'Заметки...',
        inputDetails: 'Детали',
        autoCalc: 'Авто-расчёт',
        deleteRow: 'Удалить позицию',
        perPerson: 'на чел.',
        newExpenseItem: 'Новая',
        newExpenseCategory: 'Прочее',

        // Expense categories
        categories: [
            'Площадка',
            'Кейтеринг',
            'Полиграфия',
            'Одежда',
            'Фотография',
            'Декорации',
            'Кольца',
            'Музыка и развлечения',
            'Стилист',
            'Транспорт',
            'Подарки гостям',
            'Медовый месяц',
            'Свидетели',
            'Прочее',
        ],

        // Regions (same keys, localized labels)
        regions: {
            'Baden-Württemberg': 'Баден-Вюртемберг',
            Bayern: 'Бавария',
            Berlin: 'Берлин',
            Brandenburg: 'Бранденбург',
            Bremen: 'Бремен',
            Hamburg: 'Гамбург',
            Hessen: 'Гессен',
            'Mecklenburg-Vorpommern': 'Мекленбург-Передняя Померания',
            Niedersachsen: 'Нижняя Саксония',
            'Nordrhein-Westfalen': 'Северный Рейн-Вестфалия',
            'Rheinland-Pfalz': 'Рейнланд-Пфальц',
            Saarland: 'Саарланд',
            Sachsen: 'Саксония',
            'Sachsen-Anhalt': 'Саксония-Анхальт',
            'Schleswig-Holstein': 'Шлезвиг-Гольштейн',
            Thüringen: 'Тюрингия',
            International: 'Международный',
        },
    },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        try {
            return localStorage.getItem('wedbudget_lang') || 'de';
        } catch {
            return 'de';
        }
    });

    const switchLang = (newLang) => {
        setLang(newLang);
        try {
            localStorage.setItem('wedbudget_lang', newLang);
        } catch { }
    };

    const t = translations[lang] || translations['de'];

    return (
        <LanguageContext.Provider value={{ lang, switchLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}
