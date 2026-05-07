# 博客部署指南

## 📋 部署前准备

### 1. GitHub Pages 设置

1. 访问 GitHub 仓库：https://github.com/adougebabi/adougebabi.github.io
2. 进入 **Settings** → **Pages**
3. 在 **Source** 下拉菜单中选择 **GitHub Actions**
4. 保存设置

### 2. 推送代码到 GitHub

```bash
# 确保在 blog-next 目录
cd /Users/vinson/Documents/project/个人/个人项目/blog-next

# 推送到 GitHub（首次推送）
git push -u origin main
```

## 🚀 自动部署

推送代码后，GitHub Actions 会自动：
1. 安装依赖（使用 pnpm）
2. 构建静态网站
3. 部署到 GitHub Pages

部署完成后，博客将在以下地址访问：
**https://adougebabi.github.io/**

## 📝 日常更新流程

### 添加新文章

1. 在 `src/content/blog/` 目录创建新的 `.md` 文件
2. 添加 frontmatter：

```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2026-05-07T10:00:00.000Z
heroImage: https://example.com/image.jpg  # 可选
category: ["分类"]
draft: false
tags:
  - 标签1
  - 标签2
---

文章内容...
```

3. 提交并推送：

```bash
git add .
git commit -m "feat: 添加新文章《文章标题》"
git push
```

### 修改配置

编辑 `shblog.config.ts` 文件，修改：
- 网站标题、描述
- 作者信息
- 导航链接
- 社交媒体链接

## 🛠️ 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:4321

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

## ⚙️ 技术栈

- **框架**: Astro 6.0.4
- **UI**: React 19 + Tailwind CSS 4
- **部署**: GitHub Pages
- **搜索**: Pagefind
- **评论**: Giscus（可选，需配置）

## 📚 更多信息

- Astro 文档: https://docs.astro.build
- 主题文档: 查看项目中的 `CLAUDE.md`
