# 序川个人作品网站

「序川」的轻量静态作品站，用来展示 App、个人工作流和多 Agent 开发实践，并保留后续记录入口。

## 本地运行

```powershell
npm run dev
```

打开 `http://127.0.0.1:4173`。

## 构建与校验

```powershell
npm test
npm run build
```

- `npm test`：重新构建并检查必需内容、空链接、本地资源和实名信息。
- `npm run build`：生成可部署的 `dist\`。
- 项目没有运行时 npm 依赖，只使用 Node.js 内置模块。

## 日常修改

### 修改文字、状态和链接

所有内容集中在 `src\site-data.mjs`：

- `hero`：首屏文案。
- `about`：关于区文案和关注方向。
- `projects`：项目名称、状态、特点、实践过程、限制和链接。
- `xUrl`：X 账号地址。留空时页面会隐藏对应入口。
- `productionUrl`：正式网站地址。确定后再填写，用于生成 canonical 和分享元数据。

项目链接字段为 `source`、`download`、`article`。没有真实地址时保持空字符串，页面不会生成空按钮。

### 添加最近记录

在 `records` 数组中添加：

```js
{
  title: "文章标题",
  date: "2026-09-24",
  summary: "一句简短说明。",
  url: "https://example.com/article",
}
```

数组为空时，“记录”栏目和导航项都会自动隐藏。

### 替换头像

当前文件（原图只保留在源码中，不进入构建产物）：

- 原图：`public\assets\avatar-source.png`
- 网页大图：`public\assets\avatar-720.jpg`
- 导航小图：`public\assets\avatar-256.jpg`

替换时建议保持文件名不变，等比缩放，不裁切人物、头发、衣服或河流背景。头像的替代文本在 `site-data.mjs` 的 `avatar.alt` 中修改。

### 替换项目图片

图片放在 `public\assets\`，然后修改 `site-data.mjs` 对应项目的 `media` 字段。新增图片必须填写准确的 `alt`，没有真实截图时使用 `concept-diagram` 并明确标注“概念示意”。

## 部署到独立 Netlify 站点

1. 为本目录创建新的空远程仓库，不添加旧个人网站仓库作为 remote。
2. 将仓库连接到新的 Netlify 站点。
3. 构建命令使用 `npm run build`，发布目录使用 `dist`。
4. 首次部署得到 Netlify 地址后，将其写入 `productionUrl` 并重新构建。
5. 确认标题、分享预览、X 链接和项目链接都使用“序川”品牌资料后，再绑定正式域名。

`netlify.toml` 已包含构建配置和基础安全、缓存响应头。当前仓库不自动推送、不自动部署。

