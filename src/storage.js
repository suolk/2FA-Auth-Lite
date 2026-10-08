import { normalizeBase32 } from "./totp.js";

const STORAGE_ACCOUNTS_KEY = "totpAccounts";
const LEGACY_SECRET_KEY = "totpSecret";

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

export async function persistAccounts(accounts) {
    const payload = accounts.map(({ id, username, secret, siteName, siteUrl }) => ({ id, username, secret, siteName, siteUrl }));
    await chrome.storage.local.set({ [STORAGE_ACCOUNTS_KEY]: payload });
}

export async function loadAccounts() {
    const stored = await chrome.storage.local.get([STORAGE_ACCOUNTS_KEY, LEGACY_SECRET_KEY]);
    let accounts = parseStoredAccounts(stored[STORAGE_ACCOUNTS_KEY]);

    if (!accounts.length && typeof stored[LEGACY_SECRET_KEY] === "string" && stored[LEGACY_SECRET_KEY].trim()) {
        accounts = [createAccount("GitHub", normalizeBase32(stored[LEGACY_SECRET_KEY]))];
    }

    return accounts;
}
