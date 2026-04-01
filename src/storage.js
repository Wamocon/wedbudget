export const DATA_VERSION = 1;
const LOCAL_KEY = 'wedbudget_data';

export const DEFAULT_CATEGORIES = [
    { id: '1', category: 'Location', item: 'Miete & Reinigung', estimated: 1800, actual: 0, paid: false, comment: '', isPerPerson: false, costPerPerson: 0 },
    { id: '2', category: 'Catering', item: 'Speisen & Getränke', estimated: 0, actual: 0, paid: false, comment: 'Inklusive Mitternachtssnack', isPerPerson: true, costPerPerson: 130 },
    { id: '3', category: 'Papeterie', item: 'Einladungen & Danksagungen', estimated: 0, actual: 0, paid: false, comment: 'Porto nicht vergessen', isPerPerson: true, costPerPerson: 6 },
    { id: '4', category: 'Kleidung', item: 'Brautkleid & Anzug', estimated: 2500, actual: 0, paid: false, comment: 'Änderungsschneiderei separat einplanen', isPerPerson: false, costPerPerson: 0 },
    { id: '5', category: 'Fotografie', item: 'Fotograf (ganztags)', estimated: 2000, actual: 0, paid: false, comment: '10 Stunden Begleitung', isPerPerson: false, costPerPerson: 0 },
    { id: '6', category: 'Dekoration', item: 'Blumen & Tischdeko', estimated: 1200, actual: 0, paid: false, comment: '', isPerPerson: false, costPerPerson: 0 },
    { id: '7', category: 'Ringe', item: 'Eheringe', estimated: 1500, actual: 0, paid: false, comment: 'Inkl. Gravur', isPerPerson: false, costPerPerson: 0 },
];

export const getDefaultData = () => ({
    version: DATA_VERSION,
    guestCount: 80,
    region: 'Nordrhein-Westfalen',
    totalBudget: 25000,
    expenses: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
});

// Migration logic: Protects against corrupted data and upgrades old formats
export const migrateData = (data) => {
    if (!data || typeof data !== 'object') return getDefaultData();

    let migrated = { ...data };

    // Example of future migration logic:
    // if (migrated.version < 2) {
    //   // Upgrade Step: Add priorities feature
    //   migrated.expenses = migrated.expenses.map(exp => ({ ...exp, priority: 'Mittel' }));
    // }

    // Basic validation (Türsteher)
    if (!Array.isArray(migrated.expenses)) {
        migrated.expenses = getDefaultData().expenses;
    }

    // Stamp current version
    migrated.version = DATA_VERSION;
    return migrated;
};

// 1. LocalStorage Logic
export const saveToLocal = (data) => {
    try {
        const payload = JSON.stringify({ ...data, version: DATA_VERSION });
        localStorage.setItem(LOCAL_KEY, payload);
    } catch (e) {
        console.warn('Could not save to localStorage', e);
    }
};

export const loadFromLocal = () => {
    try {
        const item = localStorage.getItem(LOCAL_KEY);
        if (!item) return null;
        return migrateData(JSON.parse(item));
    } catch (e) {
        console.error('Failed to parse local storage data', e);
        return null;
    }
};

// 2. JSON Export / Import
export const exportToJson = (data) => {
    const payload = JSON.stringify({ ...data, version: DATA_VERSION }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `wedbudget-planung-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const parseImportedJson = (jsonString) => {
    try {
        const data = JSON.parse(jsonString);
        if (!data.expenses) throw new Error("Invalid structure");
        return migrateData(data);
    } catch (e) {
        throw new Error('Ungültige oder beschädigte Datei.');
    }
};

// 3. URL Sharing
const utf8_to_b64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
const b64_to_utf8 = (str) => decodeURIComponent(escape(window.atob(str)));

export const loadFromUrl = () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get('data');
        if (!dataParam) return null;

        const jsonString = b64_to_utf8(dataParam);
        const data = JSON.parse(jsonString);
        return migrateData(data);
    } catch (e) {
        console.error('Failed to parse URL data', e);
        return null;
    }
};

export const generateShareUrl = (data) => {
    try {
        const payload = JSON.stringify({ ...data, version: DATA_VERSION });
        const b64 = utf8_to_b64(payload);
        const url = new URL(window.location.href);
        url.searchParams.set('data', b64);
        return url.toString();
    } catch (e) {
        console.error('Failed to generate share URL', e);
        return window.location.href;
    }
};
