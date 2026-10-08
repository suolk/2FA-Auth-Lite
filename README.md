# 2FA-Auth-Lite

**简体中文** | [English](README.en.md)

轻量级 TOTP（基于时间的一次性密码）验证器，用于双因素认证（2FA）。支持 Microsoft Edge 和 Firefox（Manifest V3）。

## 功能

- **通用**：生成 6 位验证码，兼容 GitHub、Google、Microsoft 等所有支持 TOTP 的平台
- **扫码添加**：上传二维码图片，或直接扫描当前标签页中的二维码，自动识别密钥和网站
- **一键复制**：点击验证码即可复制，进度条显示刷新倒计时
- **导入导出**：账户可批量导出为 JSON 文件，也可从 JSON 批量导入（相同密钥自动跳过）
- **中英文界面**：点击右上角的语言切换按钮在中文和 English 之间切换
- **隐私**：没有服务器、不发任何网络请求，数据只保存在你自己的浏览器里

## 安装

### 从商店安装

- [Microsoft Edge 扩展商店](https://microsoftedge.microsoft.com/addons/detail/mlgkegmodaokoabknaehdahemdiebejg)
- [Firefox 附加组件商店](https://addons.mozilla.org/zh-CN/firefox/addon/2fa-auth-lite/)

### 从 GitHub Releases 安装

在 [Releases 页面](https://github.com/suolk/2FA-Auth-Lite/releases) 下载对应浏览器的 zip 并解压，然后按下方「从源码加载」的步骤选择解压后的文件夹。

### 从源码加载（开发 / 预览）

先下载本仓库：`git clone https://github.com/suolk/2FA-Auth-Lite.git`，或在页面上点 **Code → Download ZIP** 并解压。

**Edge / Chrome**

1. 打开 `edge://extensions`（Chrome 为 `chrome://extensions`），打开 **开发人员模式**
2. 点击 **加载解压缩的扩展**，选择仓库根目录（包含 `manifest.json` 的文件夹）
3. 出现 `browser_specific_settings` 无法识别的提示可以忽略，这是 Firefox 专用字段

**Firefox**

1. 打开 `about:debugging#/runtime/this-firefox`
2. 点击 **临时载入附加组件…**，选择仓库根目录下的 `manifest.json`
3. 临时载入的附加组件在关闭 Firefox 后会被移除

修改代码后在扩展管理页点 **重新加载** 即可。

## 使用

### 添加账户

1. 点击浏览器工具栏中的扩展图标
2. 点击右上角的 **+** 按钮
3. 选择以下任一方式：
   - **上传二维码**：选择包含二维码的截图或图片，密钥会自动提取
   - **扫描二维码**：截取当前标签页并识别页面上的二维码
   - **手动输入**：粘贴服务提供的 **密钥**（Base32 字符串）

扫描失败时，可以在编辑页点 **扫描失败？查看解决方案**：通常是二维码分辨率不足，放大页面后再截图或扫描即可。

### 生成验证码

- 验证码每 30 秒自动刷新
- 点击任意验证码即可 **复制到剪贴板**
- 进度条显示刷新倒计时，最后 10 秒变色提示

### 导入导出

- **导出**：点击 **导出**，确认提示后下载 `2fa-auth-lite-YYYY-MM-DD.json`
- **导入**：点击 **导入** 选择 JSON 文件；与已有账户密钥相同的条目会被跳过

> 导出文件包含明文密钥，等同于你的第二重验证，请妥善保管，不要发给他人或上传到网盘。

<details>
<summary>导出文件格式</summary>

```json
{
  "version": 1,
  "exportedAt": "2026-10-08T12:00:00.000Z",
  "accounts": [
    { "username": "alice", "secret": "JBSWY3DPEHPK3PXP", "siteName": "GitHub", "siteUrl": "https://github.com" }
  ]
}
```

导入也接受直接的账户数组 `[{ "username", "secret", "siteName", "siteUrl" }]`。

</details>

## 权限说明

- `storage`：在本地保存账户数据和语言偏好
- `clipboardWrite`：复制验证码到剪贴板
- `activeTab`：点击 **扫描二维码** 时截取当前标签页

## 数据存储与隐私

- 所有数据通过 `chrome.storage.local` 保存在本机浏览器中，不会同步，也不会发送到任何外部服务器
- 密钥以明文形式保存在浏览器的扩展存储中，请不要在他人的设备上使用

## 常见问题

**验证码无法使用**

- 检查系统时钟是否准确
- 确认密钥输入正确
- 部分服务使用非标准 TOTP 参数（非 SHA-1 / 6 位 / 30 秒），暂不支持

---

## 开发

### 目录结构

```
manifest.json         扩展清单（MV3，含 Firefox 的 browser_specific_settings.gecko）
_locales/             扩展名称、描述的中英文（浏览器标准 i18n，用于商店和扩展管理页）
popup/                扩展面板 popup.html / popup.js / popup.css
src/totp.js           Base32 解码与 TOTP 计算（Web Crypto）
src/storage.js        账户存储封装：storage.local 读写与旧数据迁移
src/i18n.js           界面文案（中文 / English）
src/state.js          共享状态与 DOM 引用
src/ui.js             渲染列表、编辑页、提示与语言切换
src/qr.js             二维码识别：上传图片、截取当前标签页
src/sites.js          常见服务名称到网址的映射
src/vendor/zxing.js   第三方库 @zxing/library（UMD 构建，https://github.com/zxing-js/library），用于二维码解码
icons/                16 / 32 / 48 / 128 图标
scripts/pack.mjs      打包脚本（无依赖），生成 Edge 与 Firefox 的 zip
```

### 打包

```bash
node scripts/pack.mjs
```

在 `dist/` 下生成 Edge 和 Firefox 两个 zip 包（需要 Node.js 18+）。

### 兼容性

- Edge / Chrome 109+
- Firefox 142+

## 许可证

[MIT](LICENSE) © 2026 suolk
