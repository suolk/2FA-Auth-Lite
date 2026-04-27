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

function fillFromQrData(qrData) {
    const { secret, username, siteName } = parseOtpAuthUri(qrData);
    editSecretInput.value = secret;
    if (username) editNameInput.value = username;
    if (siteName) {
        editSiteNameInput.value = siteName;
        const url = lookupSiteUrl(siteName);
        if (url) editSiteUrlInput.value = url;
    }
    setEditorStatus(t("toastQrScanned"));
}

function reportScanError(err, notFoundKey, fallbackKey) {
    setEditorStatus(
        err instanceof Error ? err.message : t(fallbackKey),
        true
    );
}

// 使用 jsQR 解码二维码
async function decodeQrFromImage(imageFile) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // 使用 jsQR 解码
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                resolve(code.data);
            } else {
                reject(new Error(t("toastNoQrFound")));
            }
        };

        img.onerror = () => reject(new Error(t("toastImageLoadFailed")));

        // 读取文件为 Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error(t("toastFileReadFailed")));
        reader.readAsDataURL(imageFile);
    });
}

// PWA: 从文件扫描二维码
export async function scanQrFromFile(file) {
    try {
        const qrData = await decodeQrFromImage(file);
        fillFromQrData(qrData);
    } catch (err) {
        reportScanError(err, "toastNoQrFound", "toastScanFailed");
    }
}
