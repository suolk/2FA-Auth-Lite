import { normalizeBase32 } from "./totp.js";

const STORAGE_ACCOUNTS_KEY = "totpAccounts";
const LEGACY_SECRET_KEY = "totpSecret";
const STORAGE_LANG_KEY = "lang";

export function createAccount(username = "", secret = "", siteName = "", siteUrl = "") {
    return {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        username,
        secret,
        siteName,
        siteUrl,
        lastCode: "",
        error: ""
    };
}

export function parseStoredAccounts(rawAccounts) {
    if (!Array.isArray(rawAccounts)) return [];

    return rawAccounts
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
            id: typeof item.id === "string" && item.id ? item.id : createAccount().id,
            username: typeof item.username === "string" ? item.username : (typeof item.name === "string" ? item.name : ""),
            secret: typeof item.secret === "string" ? item.secret : "",
            siteName: typeof item.siteName === "string" ? item.siteName : "",
            siteUrl: typeof item.siteUrl === "string" ? item.siteUrl : "",
            lastCode: "",
            error: ""
        }));
}

// PWA: Use localStorage instead of chrome.storage
export async function persistAccounts(accounts) {
    const payload = accounts.map(({ id, username, secret, siteName, siteUrl }) => ({ id, username, secret, siteName, siteUrl }));
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(payload));
}

export async function loadAccounts() {
    const accountsJson = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    const legacySecret = localStorage.getItem(LEGACY_SECRET_KEY);

    let accounts = [];
    if (accountsJson) {
        try {
            accounts = parseStoredAccounts(JSON.parse(accountsJson));
        } catch {
            accounts = [];
        }
    }

    if (!accounts.length && legacySecret && legacySecret.trim()) {
        accounts = [createAccount("GitHub", normalizeBase32(legacySecret))];
    }

    return accounts;
}

// PWA: Language preference storage
export async function saveLangPreference(lang) {
    localStorage.setItem(STORAGE_LANG_KEY, lang);
}

export async function loadLangPreference() {
    return localStorage.getItem(STORAGE_LANG_KEY);
}
