const PERIOD_SECONDS = 30;
const DIGITS = 6;

export function formatCode(code) {
    return `${code.slice(0, 3)} ${code.slice(3)}`;
}

export function normalizeBase32(base32) {
    return base32.replace(/\s+/g, "").replace(/=+$/g, "").toUpperCase();
}

export function decodeBase32(base32) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const normalized = normalizeBase32(base32);

    if (!normalized) throw new Error("Secret is empty.");

    let bits = "";
    for (const char of normalized) {
        const value = alphabet.indexOf(char);
        if (value === -1) throw new Error("Secret must be valid Base32.");
        bits += value.toString(2).padStart(5, "0");
    }

    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }

    return new Uint8Array(bytes);
}

async function hmacSha1(keyBytes, counterBytes) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, counterBytes);
    return new Uint8Array(signature);
}

function counterToBytes(counter) {
    const bytes = new Uint8Array(8);
    for (let i = 7; i >= 0; i -= 1) {
        bytes[i] = counter & 0xff;
        counter = Math.floor(counter / 256);
    }
    return bytes;
}

export async function generateTotp(secret) {
    const key = decodeBase32(secret);
    const counter = Math.floor(Date.now() / 1000 / PERIOD_SECONDS);
    const digest = await hmacSha1(key, counterToBytes(counter));

    const offset = digest[digest.length - 1] & 0x0f;
    const binary =
        ((digest[offset] & 0x7f) << 24) |
        ((digest[offset + 1] & 0xff) << 16) |
        ((digest[offset + 2] & 0xff) << 8) |
        (digest[offset + 3] & 0xff);

    return (binary % 10 ** DIGITS).toString().padStart(DIGITS, "0");
}
