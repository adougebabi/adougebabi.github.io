---
title: 博客重构记录：从 Hexo 迁移到 Astro
description: 记录将 5 年前的 Hexo 博客重构为现代化 Astro 博客的完整过程，包括技术选型、迁移步骤和踩过的所有坑
pubDate: 2026-05-07T11:30:00.000Z
heroImage: https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200
category: ["技术实践"]
draft: false
tags:
  - Astro
  - Hexo
  - 博客迁移
  - Cloudflare Pages
---

## 前言

时隔 5 年，终于下定决心重构博客了。旧博客使用 Hexo 搭建，虽然当时很流行，但现在看来确实有些过时。这次选择了 Astro 作为新的博客框架，整个迁移过程踩了不少坑，特此记录。

## 为什么要重构？

### 旧博客的问题

1. **技术栈老旧**
   - Hexo 5.1.1（2020 年版本）
   - 构建速度慢
   - 开发体验一般
   - 缺少现代化特性

2. **维护困难**
   - 5 年没更新，依赖版本过旧
   - 主题定制困难
   - 缺少搜索功能

3. **部署问题**
   - GitHub Pages 国内访问慢
   - 没有 CDN 加速
   - 构建不稳定

### 为什么选择 Astro？

1. **性能优秀**
   - 零 JS 默认输出
   - 构建速度极快
   - 自动图片优化

2. **开发体验好**
   - 支持 MDX
   - 组件化开发
   - TypeScript 支持
   - 热更新快

3. **生态丰富**
   - 集成 React、Vue 等框架
   - 丰富的插件系统
   - 现代化的工具链

## 技术栈对比

| 项目 | 旧版 (Hexo) | 新版 (Astro) |
|------|------------|--------------|
| 框架版本 | Hexo 5.1.1 (2020) | Astro 6.0.4 (2026) |
| 构建速度 | 较慢 | 极快 ⚡ |
| 开发体验 | 一般 | 现代化 🚀 |
| 搜索功能 | 无 | Pagefind ✅ |
| UI 组件 | 有限 | React + shadcn/ui ✅ |
| 响应式图片 | 手动 | 自动优化 ✅ |
| 部署平台 | GitHub Pages | Cloudflare Pages |
| 国内访问 | 慢 | 快（CDN 加速）|

## 迁移步骤

### 1. 选择主题

选择了 [sh-blog-next](https://github.com/510208/sh-blog-next) 主题，特点：
- 基于 Astro 6.0
- 支持 MDX
- 集成 Tailwind CSS 4
- 内置搜索功能
- 响应式设计

### 2. 配置博客信息

修改 `shblog.config.ts`：

```typescript
export const config: Config = {
  title: "阿兜哥爸爸的博客",
  description: "记录技术成长的点点滴滴",
  lang: "zh-CN",
  author: {
    name: "笨叔丶",
    bio: "一个热爱技术的开发者",
    // ... 其他配置
  }
}
```

### 3. 迁移文章

#### 3.1 Frontmatter 格式转换

**Hexo 格式：**
```yaml
---
title: 文章标题
date: 2020-09-04 11:08:11
tags:
  - Java
  - RPC
cover: https://example.com/image.jpg
---
```

**Astro 格式：**
```yaml
---
title: 文章标题
description: 文章描述
pubDate: 2020-09-04T11:08:11.000Z
heroImage: https://example.com/image.jpg
category: ["技术实践"]
draft: false
tags:
  - Java
  - RPC
---
```

#### 3.2 批量转换脚本

手动转换 5 篇文章的 frontmatter，主要改动：
- `date` → `pubDate`（ISO 8601 格式）
- `cover` → `heroImage`
- 添加 `description` 字段
- 添加 `category` 分类
- 添加 `draft` 状态

### 4. 初始化 Git 仓库

```bash
cd blog-next
git init
git remote add origin https://github.com/adougebabi/adougebabi.github.io.git
git add .
git commit -m "feat: 重构博客到 Astro 框架"
git push -u origin main
```

## 部署到 Cloudflare Pages

### 为什么选择 Cloudflare Pages？

1. **全球 CDN 加速** - 300+ 数据中心
2. **国内访问快** - 比 GitHub Pages 快 3-5 倍
3. **无限带宽** - 完全免费
4. **构建速度快** - 平均 1-2 分钟
5. **自动 HTTPS** - 免费 SSL 证书

### 部署步骤

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Workers & Pages** → **Create application** → **Pages**
3. 连接 GitHub 仓库
4. 配置构建设置：
   - **Framework preset**: `Astro`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`（留空）
   - **Environment variables**:
     - `NODE_VERSION` = `22`
     - `PNPM_VERSION` = `10`

5. 点击 **Save and Deploy**

## 踩过的坑

### 坑 1：pnpm 版本不兼容

**问题：**
```
ERR_PNPM_UNSUPPORTED_ENGINE
Expected version: >=10.0.0
Got: 9.10.0
```

**原因：** 主题要求 pnpm 10+，但 Cloudflare Pages 默认使用 9.10.0

**解决：** 降低 `package.json` 中的版本要求
```json
{
  "engines": {
    "pnpm": ">=9.0.0"  // 原来是 >=10.0.0
  }
}
```

### 坑 2：远程图片不允许

**问题：**
```
[ERROR] Remote image https://raw.giteeusercontent.com/... is not allowed
```

**原因：** Astro 默认不允许外部图片链接

**解决：** 在 `astro.config.mjs` 添加域名白名单
```javascript
export default defineConfig({
  image: {
    domains: ["raw.giteeusercontent.com"],
  },
  // ...
})
```

### 坑 3：heroImage 类型错误

**问题：**
```
[ERROR] Transform failed with 1 error
```

**原因：** `heroImage` 类型定义只接受本地图片，不接受字符串 URL

**解决：** 修改 `src/content.config.ts`
```typescript
schema: ({ image }) =>
  z.object({
    // 支持本地图片或外部 URL
    heroImage: z.union([image(), z.string()]).optional(),
    // ...
  }),
```

### 坑 4：Cloudflare Workers 模式错误

**问题：**
```
[ERROR] Unexpected token `.`. Expected ... , *,  (, [, :, , ?, = or an identifier
```

**原因：** 创建项目时选择了 **Workers**，自动添加了 `@astrojs/cloudflare` 适配器，但纯静态博客不需要

**解决：** 
1. 删除项目重新创建
2. 选择 **Pages**（不是 Workers）
3. 不要设置 **Deploy command**
4. Cloudflare Pages 会自动部署 `dist` 目录

### 坑 5：根目录配置错误

**问题：**
```
Failed: root directory not found
```

**原因：** 将 **Root directory** 设置成了 `dist`（输出目录）

**解决：** 
- **Root directory**: `/`（项目根目录，留空）
- **Build output directory**: `dist`（构建输出目录）

## 最终效果

### 性能提升

- **构建时间**：从 5 分钟降到 1.5 分钟
- **首屏加载**：从 3s 降到 0.8s
- **Lighthouse 评分**：从 75 提升到 98

### 功能增强

- ✅ 全文搜索（Pagefind）
- ✅ 响应式图片优化
- ✅ 代码高亮（Shiki）
- ✅ 数学公式支持（KaTeX）
- ✅ RSS 订阅
- ✅ Sitemap 自动生成

### 访问速度

- **国内访问**：从 5s 降到 1s
- **全球 CDN**：自动分发到 300+ 节点
- **HTTPS**：自动配置，免费证书

## 总结

### 经验教训

1. **选对平台很重要** - Cloudflare Pages 比 GitHub Pages 更适合国内用户
2. **仔细阅读文档** - 很多坑都是配置不当导致的
3. **类型定义要准确** - TypeScript 的类型检查能避免很多问题
4. **环境变量要配对** - 本地和生产环境的差异要注意

### 后续计划

- [ ] 添加评论系统（Giscus）
- [ ] 配置自定义域名
- [ ] 优化 SEO
- [ ] 添加更多文章
- [ ] 集成分析工具

### 相关资源

- **新博客地址**：https://blog.adoumi.site
- **GitHub 仓库**：https://github.com/adougebabi/adougebabi.github.io
- **Astro 文档**：https://docs.astro.build
- **主题仓库**：https://github.com/510208/sh-blog-next

## 写在最后

这次重构虽然踩了不少坑，但最终效果还是很满意的。现代化的技术栈带来了更好的开发体验和用户体验，Cloudflare Pages 的全球 CDN 也解决了国内访问慢的问题。

如果你也有老旧的博客想要重构，希望这篇文章能给你一些参考。遇到问题不要慌，仔细看错误日志，大部分问题都能在文档中找到答案。

最后，感谢 Astro 和 Cloudflare 提供的优秀工具！🎉
