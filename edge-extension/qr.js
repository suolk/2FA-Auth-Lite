import { lookupSiteUrl } from "./sites.js";
import { t, setEditorStatus } from "./ui.js";
import { editSecretInput, editNameInput, editSiteNameInput, editSiteUrlInput } from "./state.js";

function parseOtpAuthUri(uri) {
    const url = new URL(uri);
    if (url.protocol !== "otpauth:") throw new Error(t("toastNotOtpAuth"));
    const secret = url.searchParams.get("secret") || "";
    const issuer = url.searchParams.get("issuer") || "";
    const label = decodeURIComponent(url.pathname.slice(1));
    const colonIdx = label.indexOf(":");
    const username = colonIdx !== -1 ? label.slice(colonIdx + 1).trim() : label.trim();
    const siteName = issuer || (colonIdx !== -1 ? label.slice(0, colonIdx).trim() : "");
    return { secret, username, siteName };
}

function fillFromQrResult(result) {
    const { secret, username, siteName } = parseOtpAuthUri(result.getText());
    editSecretInput.value = secret;
    if (username) editNameInput.value = username;
    if (siteName) {
        editSiteNameInput.value = siteName;
        const url = lookupSiteUrl(siteName);
        if (url) editSiteUrlInput.value = url;
    }
    setEditorStatus(t("toastQrScanned"));
}

function makeZxingReader() {
    const hints = new Map();
    hints.set(window.ZXing.DecodeHintType.TRY_HARDER, true);
    return new window.ZXing.BrowserQRCodeReader(hints);
}

function loadImageFromDataUrl(dataUrl, loadErrorMessage) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(loadErrorMessage));
        image.src = dataUrl;
    });
}

async function decodeQrFromDataUrl(dataUrl, loadErrorKey) {
    const img = await loadImageFromDataUrl(dataUrl, t(loadErrorKey));
    return makeZxingReader().decodeFromImageElement(img);
}

function reportScanError(err, notFoundKey, fallbackKey) {
    setEditorStatus(
        err?.name === "NotFoundException"
            ? t(notFoundKey)
            : (err instanceof Error ? err.message : t(fallbackKey)),
        true
    );
}

export async function scanQrFromFile(file) {
    try {
        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error(t("toastFileReadFailed")));
            reader.readAsDataURL(file);
        });
        fillFromQrResult(await decodeQrFromDataUrl(dataUrl, "toastImageLoadFailed"));
    } catch (err) {
        reportScanError(err, "toastNoQrFound", "toastScanFailed");
    }
}

export async function captureAndScanQr() {
    try {
        const dataUrl = await chrome.tabs.captureVisibleTab({ format: "png" });
        fillFromQrResult(await decodeQrFromDataUrl(dataUrl, "toastCaptureFailed"));
    } catch (err) {
        reportScanError(err, "toastNoQrOnPage", "toastCaptureFailed");
    }
}
