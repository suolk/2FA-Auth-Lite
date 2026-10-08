# 2FA-Auth-Lite

[简体中文](README.md) | **English**

A lightweight TOTP (Time-based One-Time Password) authenticator for two-factor authentication (2FA). Works in Microsoft Edge and Firefox (Manifest V3).

## Features

- **Universal**: generates 6-digit codes for GitHub, Google, Microsoft and any other service that supports TOTP
- **Add by QR code**: upload a QR image, or scan the QR code in the current tab; the secret and site are filled in automatically
- **One-click copy**: click a code to copy it; a progress bar shows when it refreshes
- **Import / export**: export all accounts to a JSON file, or batch-import from one (duplicate secrets are skipped)
- **Chinese / English**: switch the interface language from the top-right corner
- **Private**: no server and no network requests; your data stays in your own browser

## Installation

### From the stores

- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/mlgkegmodaokoabknaehdahemdiebejg)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/2fa-auth-lite/)

### From GitHub Releases

Download the zip for your browser from the [Releases page](https://github.com/suolk/2FA-Auth-Lite/releases), extract it, and load the extracted folder as described below.

### Load from source (development / preview)

Clone the repo with `git clone https://github.com/suolk/2FA-Auth-Lite.git`, or click **Code → Download ZIP** and extract it.

**Edge / Chrome**

1. Open `edge://extensions` (or `chrome://extensions`) and turn on **Developer mode**
2. Click **Load unpacked** and select the repository root (the folder containing `manifest.json`)
3. A warning about the unrecognized `browser_specific_settings` key can be ignored; it is Firefox-only

**Firefox**

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…** and select `manifest.json` in the repository root
3. Temporary add-ons are removed when Firefox closes

After changing the code, click **Reload** on the extensions page.

## Usage

### Adding an account

1. Click the extension icon in the browser toolbar
2. Click the **+** button in the top-right corner
3. Choose one of:
   - **Upload QR**: pick a screenshot or image containing the QR code; the secret is extracted automatically
   - **Scan QR**: capture the current tab and read the QR code on the page
   - **Manual entry**: paste the **secret key** (the Base32 string the service gives you)

If scanning fails, click **Scan failed? See solutions** in the editor. Usually the QR code is too small; zoom in on the page and try again.

### Generating codes

- Codes refresh every 30 seconds
- Click any code to **copy it to the clipboard**
- The progress bar shows the time left and changes color in the last 10 seconds

### Import / export

- **Export**: click **Export**, confirm the warning, and `2fa-auth-lite-YYYY-MM-DD.json` is downloaded
- **Import**: click **Import** and choose a JSON file; entries whose secret already exists are skipped

> The export file contains your secrets in plain text, which is as good as your second factor. Keep it safe and do not share it or upload it to cloud storage.

<details>
<summary>Export file format</summary>

```json
{
  "version": 1,
  "exportedAt": "2026-10-08T12:00:00.000Z",
  "accounts": [
    { "username": "alice", "secret": "JBSWY3DPEHPK3PXP", "siteName": "GitHub", "siteUrl": "https://github.com" }
  ]
}
```

A bare array of accounts `[{ "username", "secret", "siteName", "siteUrl" }]` is also accepted.

</details>

## Permissions

- `storage`: save your accounts and language preference locally
- `clipboardWrite`: copy codes to the clipboard
- `activeTab`: capture the current tab when you click **Scan QR**

## Storage and privacy

- All data is kept in `chrome.storage.local` on this device. It is not synced and never sent to any server
- Secrets are stored in plain text in the browser's extension storage, so do not use this extension on someone else's device

## Troubleshooting

**Codes don't work**

- Check that your system clock is accurate
- Make sure the secret was entered correctly
- Services using non-standard TOTP parameters (other than SHA-1 / 6 digits / 30 seconds) are not supported

---

## Development

### Project layout

```
manifest.json         Extension manifest (MV3, with Firefox's browser_specific_settings.gecko)
_locales/             Extension name and description in Chinese / English (standard browser i18n)
popup/                Toolbar popup: popup.html / popup.js / popup.css
src/totp.js           Base32 decoding and TOTP generation (Web Crypto)
src/storage.js        Account storage: storage.local read/write and legacy data migration
src/i18n.js           UI strings (Chinese / English)
src/state.js          Shared state and DOM references
src/ui.js             Rendering of the list, editor, toasts and language switch
src/qr.js             QR decoding: uploaded images and current-tab capture
src/sites.js          Mapping of common service names to URLs
src/vendor/zxing.js   Third-party @zxing/library (UMD build) for QR decoding
icons/                16 / 32 / 48 / 128 icons
scripts/pack.mjs      Dependency-free packaging script for the Edge and Firefox zips
```

### Packaging

Requires Node.js 18+:

```bash
node scripts/pack.mjs
```

This produces `dist/2fa-auth-lite-edge-<version>.zip` (without `browser_specific_settings`) and `dist/2fa-auth-lite-firefox-<version>.zip` (manifest unchanged).

> Don't package with `Compress-Archive` from Windows PowerShell 5.1: its zips use backslashes in entry paths, which addons.mozilla.org rejects.

Remember to bump `version` in `manifest.json` before each release.

### Release notes

- The Firefox add-on ID is `tiny-auth@suolk.com` (`manifest.json` → `browser_specific_settings.gecko.id`). It belongs to the publisher's AMO account; **do not change it**, or existing users will stop receiving updates
- `src/vendor/zxing.js` is the minified third-party library [@zxing/library](https://github.com/zxing-js/library); mention this if AMO reviewers ask about its source
- Store assets (icons, promo tiles, listing text) live in `dist/store/` and are not tracked by git

### Compatibility

- Edge / Chrome 109+
- Firefox 142+

## License

[MIT](LICENSE) © 2026 suolk
