# Tiny Auth

[English](#english) | [中文](#中文)

---

## 中文

一个用于管理 TOTP（基于时间的一次性密码）两步验证码的 Chrome 扩展。支持多账户管理、二维码扫描，以及中英文界面切换。

### 功能

- 为多个账户生成 TOTP 验证码，进度条实时显示剩余时间
- 点击验证码即可复制到剪贴板
- 支持上传图片或截取当前标签页来扫描二维码，扫码后自动填充账户信息
- 内置网站名称与 URL 映射表
- 新建账户时若未填写密钥则自动丢弃，返回时自动保存
- 支持账户的 JSON 批量导出与导入（按密钥去重）
- 中英文界面一键切换，偏好持久保存
- 所有数据本地存储于 `chrome.storage.local`，不上传任何服务器

### 安装方法

本扩展未上架 Chrome 应用商店，需手动安装：

1. 下载或克隆本仓库
2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启右上角的**开发者模式**
4. 点击**加载已解压的扩展程序**，选择项目文件夹
5. 扩展图标将出现在工具栏中

### 第三方库

以下库已打包在仓库中：

| 文件       | 库                                                    | 许可证 |
| ---------- | ----------------------------------------------------- | ------ |
| `zxing.js` | [@zxing/library](https://github.com/zxing-js/library) | MIT    |

### 权限说明

| 权限             | 用途                         |
| ---------------- | ---------------------------- |
| `storage`        | 在本地保存账户数据和语言偏好 |
| `clipboardWrite` | 将验证码复制到剪贴板         |
| `activeTab`      | 截取当前标签页以扫描二维码   |

### 安全说明

- 所有账户数据（包括 TOTP 密钥）以明文形式存储在 `chrome.storage.local` 中
- 导出的备份文件同样包含明文密钥，请妥善保管，切勿分享给他人
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

A Chrome extension for managing TOTP (Time-based One-Time Password) two-factor authentication codes. Supports multiple accounts, QR code scanning, and Chinese/English interface.

### Features

- Generate TOTP codes for multiple accounts with a per-account progress bar
- Click any code to copy it to clipboard
- Scan QR codes from image files or capture the current tab, with auto-fill of account info
- Built-in site name → URL mapping
- New accounts are discarded if no key is entered; existing accounts auto-save on back
- Export and import accounts as JSON (deduplication by secret key)
- Chinese / English interface toggle with persistent preference
- All data stored locally in `chrome.storage.local`

### Installation

This extension is not published on the Chrome Web Store. Install it manually:

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the project folder
5. The extension icon will appear in your toolbar

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
- Exported backup files also contain secrets in plain text — keep them safe and do not share them
- No data is ever sent to any server

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
