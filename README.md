# 江文杰的技术博客

这是我的个人技术博客，专注于微服务架构、分布式系统、高并发调优等技术领域的深度分享。

## 🚀 技术栈

- **框架**: Astro v5 + React 19
- **样式**: Tailwind CSS v4 + shadcn/ui
- **内容**: MDX + Content Collections
- **部署**: Cloudflare Pages
- **包管理**: pnpm

## 📦 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查
pnpm astro check
```

## 🔨 构建部署

```bash
# 构建生产版本
pnpm build

# 本地预览
pnpm preview

# 部署到 Cloudflare Pages
pnpm deploy
```

## 📝 添加文章

在 `src/content/blog/` 目录下创建 `.md` 或 `.mdx` 文件：

```yaml
---
title: "文章标题"
description: "文章描述"
pubDate: "2026-05-07"
heroImage: "../../assets/your-image.jpg" # 可选
tags: ["标签1", "标签2"] # 可选
---

文章内容...
```

## 🎨 主要特性

- ✅ 响应式设计，支持移动端
- ✅ MDX 支持，可在 Markdown 中使用 React 组件
- ✅ 代码高亮（Shiki）
- ✅ 数学公式支持（KaTeX）
- ✅ 全文搜索（Pagefind）
- ✅ RSS 订阅
- ✅ 目录导航
- ✅ 阅读时间估算

## 📂 项目结构

```
├── src/
│   ├── components/     # React/Astro 组件
│   ├── content/        # 博客文章（Markdown/MDX）
│   ├── layouts/        # 页面布局
│   ├── pages/          # 路由页面
│   ├── styles/         # 全局样式
│   └── utils/          # 工具函数
├── public/             # 静态资源
├── shblog.config.ts    # 博客配置
└── astro.config.mjs    # Astro 配置
```

## ⚙️ 配置

网站的主要配置在 `shblog.config.ts` 中，包括：

- 网站基本信息（标题、描述、语言）
- 作者信息
- 导航栏链接
- 页脚设置
- 评论系统配置
- RSS 配置

## 🙏 致谢

本博客基于 [SHBlog Next](https://github.com/sam510208/SHBlog-Next) 框架构建，感谢原作者的开源贡献。

## 📄 许可证

本项目内容采用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 许可协议。
