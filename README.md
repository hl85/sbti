# SBTI 人格测试(中英双语版） 一键发布Cloudflare

> MBTI 已经过时，SBTI 来了。

SBTI（Silly Big Personality Test）是一个娱乐向人格测试 Web App。本项目基于 Vue 3 复刻并扩展了完整测试流程，现已支持 **中文 / English 双版本**、**人格图鉴**、**分享页**、**What is SBTI 说明页** 与 **Cloudflare Worker 部署**。

在线地址：<https://sbti.funmbti.com/>

## ✨ 当前功能

- 🧠 **31 道正式题 + 2 道隐藏触发题**
- 🎭 **26 种人格类型**，包含隐藏人格
- 🌐 **中英双版本路由**：`/cn` 与 `/en`
- 📊 **15 维度结果展示** 与匹配度分析
- 📸 **结果图一键导出**（基于 `html2canvas`）
- 🔗 **独立分享页**：支持按人格类型生成可分享链接
- 🖼️ **人格图鉴页**：可直接浏览全部人格
- 📚 **What is SBTI 页面**：介绍来源、传播背景与公开参考资料
- 🔎 **SEO 支持**：动态 meta、Open Graph、Twitter Card、JSON-LD
- ☁️ **Cloudflare Worker 部署支持**
- 📱 **移动端适配**

## 🗺️ 页面结构

- `/` → 默认跳转到 `/en`
- `/cn` / `/en` → 首页
- `/:version/test` → 测试页
- `/:version/result` → 结果页
- `/:version/share/:type` → 某人格的分享页
- `/:version/gallery` → 人格图鉴页
- `/what-is-sbti` → SBTI 介绍页

其中 `:version` 目前支持：

- `cn`
- `en`

历史版本路由 `v1` / `v2` 会自动重定向到 `cn` / `en`。

## 🛠️ 技术栈

- Vue 3
- Vue Router 4
- Vite
- html2canvas
- qrcode.vue
- Cloudflare Workers（部署）

## 📁 关键文件

- `src/router/index.js`：路由、语言切换、SEO meta 注入
- `src/views/`：各页面视图（首页 / 测试 / 结果 / 分享 / 图鉴 / 说明页）
- `src/data/sbtiData.js`：中文题目与人格数据
- `src/data/sbtiDataEN.js`：英文题目与人格数据
- `src/composables/useSBTI.js`：测试流程与结果计算逻辑
- `src/composables/useTypePoster.js`：结果图导出逻辑
- `sbti-app-worker.js`：Cloudflare Worker 静态站点入口
- `wrangler.toml`：Cloudflare Worker 配置

## 🚀 本地开发

```bash
npm install
npm run dev
```

默认开发地址通常为：<http://localhost:5173>

## 📦 构建

```bash
npm run build
npm run build:worker
```

构建产物输出到：

```bash
dist/
```

## ☁️ 部署说明

当前仓库已包含 Cloudflare Worker 部署所需文件：

- `sbti-app-worker.js`
- `wrangler.toml`

部署思路为：

1. 使用 Vite 构建生成 `dist/`
2. 运行 `npm run build:worker`，把最新 `dist/` 产物内联到 `sbti-app-worker.js`
3. 由 Cloudflare Worker 提供静态资源
4. 自定义域名绑定到 `sbti.funmbti.com`

推荐直接使用：

```bash
npm run deploy
```

如果你要重新部署，请先确认：

- DNS 已接入 Cloudflare
- 自定义域名已绑定到对应 Worker
- Cloudflare 已开启 HTTPS

## 📝 说明

- 本项目仅供学习与交流使用
- SBTI 为娱乐向内容，不构成任何心理学诊断结论
- 页面中的部分“传播背景”内容来自公开网页资料整理

## 🙏 致谢

- 原始传播来源之一：[B站 @蛆肉儿串儿](https://space.bilibili.com/417038183)
- 公开参考资料见站内 `/what-is-sbti` 页面
- **本项目最早复刻自**：[Chapoii/sbti](https://github.com/Chapoii/sbti)
- **本项目仅供学习交流，请勿用于商业用途**
