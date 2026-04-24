# Tiny Auth

[English](#english) | [中文](#中文)

---

## 中文

### 安装方法

本扩展于 Edge 应用商店审核中，需手动安装：

1. 跳转到 https://github.com/suolk/Tiny-Auth/releases/tag/v0.1.0 下载压缩包
2. 解压到本地文件夹
3. 打开浏览器，访问扩展页面（ 设置 > 扩展 > 管理扩展）
4. 开启右上角的**开发者模式**
5. 点击**加载已解压的扩展程序**，选择解压的文件夹
6. 扩展图标将出现在工具栏中

一个用于管理 两步验证码的 Chrome/Edge 扩展。支持多账户管理、二维码扫描，以及中英文界面切换。

### 功能

- 为多个账户生成 TOTP 验证码，进度条实时显示剩余时间
- 点击验证码即可复制到剪贴板
- 支持上传图片或截取当前标签页来扫描二维码，扫码后自动填充账户信息
- 中英文界面一键切换，偏好持久保存
- 所有数据本地存储，不上传任何服务器

### 第三方库

以下库已打包在仓库中：

| 文件       | 库                                                    | 许可证 |
| ---------- | ----------------------------------------------------- | ------ |
| `zxing.js` | [@zxing/library](https://github.com/zxing-js/library) | MIT    |


### 安全说明

- 所有账户数据（包括 TOTP 密钥）以明文形式存储在本地缓存中
- 本扩展不会向任何服务器发送任何数据

### 项目结构

```
├── manifest.json     # 扩展清单（MV3）
├── popup.html        # 弹窗 UI
├── popup.css         # 样式
├── popup.js          # 事件处理与业务逻辑
├── ui.js             # 渲染、视图切换、i18n
├── qr.js             # 二维码扫描
├── state.js          # 共享状态与 DOM 引用
├── totp.js           # TOTP 算法（RFC 6238）
├── storage.js        # 账户持久化
├── i18n.js           # 中英文字符串
├── sites.js          # 网站名称 → URL 映射表
└── zxing.js          # 二维码解码库
```

---

## English

### Installation

This extension is currently under review in the Edge Add-ons store, so manual installation is required:

1. Go to https://github.com/suolk/Tiny-Auth/releases/tag/v0.1.0 and download the archive
2. Extract it to a local folder
3. Open your browser and go to the extensions page (Settings > Extensions > Manage extensions)
4. Enable **Developer mode** (top-right)
5. Click **Load unpacked** and select the extracted folder
6. The extension icon will appear in your toolbar

A Chrome/Edge extension for managing two-factor authentication codes. Supports multi-account management, QR scanning, and Chinese/English interface switching.

### Features

- Generate TOTP codes for multiple accounts with a real-time remaining-time progress bar
- Click any code to copy it to clipboard
- Scan QR codes from uploaded images or by capturing the current tab, with automatic account info fill-in
- Built-in site name to URL mapping table
- New accounts are automatically discarded if no secret is entered; existing accounts auto-save when going back
- Supports JSON batch export/import for accounts (deduplicated by secret)
- One-click Chinese/English UI switch with persistent preference
- All data is stored locally in `chrome.storage.local` and never uploaded to any server

### Third-party Libraries

The following libraries are bundled in the repository:

| File       | Library                                               | License |
| ---------- | ----------------------------------------------------- | ------- |
| `zxing.js` | [@zxing/library](https://github.com/zxing-js/library) | MIT     |

### Permissions

| Permission       | Reason                                        |
| ---------------- | --------------------------------------------- |
| `storage`        | Save accounts and language preference locally |
| `clipboardWrite` | Copy TOTP codes to clipboard                  |
| `activeTab`      | Capture the current tab for QR code scanning  |

### Security

- All account data (including TOTP secrets) is stored in plain text in `chrome.storage.local`
- This extension does not send any data to external servers

### Project Structure

```
├── manifest.json     # Extension manifest (MV3)
├── popup.html        # Main popup UI
├── popup.css         # Styles
├── popup.js          # Event handling and business logic
├── ui.js             # Rendering, view switching, i18n
├── qr.js             # QR code scanning
├── state.js          # Shared state and DOM references
├── totp.js           # TOTP algorithm (RFC 6238)
├── storage.js        # Account persistence
├── i18n.js           # Chinese / English strings
├── sites.js          # Site name → URL mapping
└── zxing.js          # QR decode library
```
