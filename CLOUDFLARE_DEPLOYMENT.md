# Cloudflare Pages 部署指南

## 🚀 快速部署步骤

### 1. 推送代码到 GitHub

```bash
cd /Users/vinson/Documents/project/个人/个人项目/blog-next
git push -u origin main
```

### 2. 注册/登录 Cloudflare

访问：https://dash.cloudflare.com/sign-up

### 3. 创建 Cloudflare Pages 项目

1. 登录后，点击左侧 **Workers & Pages**
2. 点击 **Create application** → **Pages** → **Connect to Git**
3. 授权 GitHub 访问权限
4. 选择仓库：`adougebabi/adougebabi.github.io`
5. 配置构建设置：

   **Framework preset**: `Astro`
   
   **Build command**: `pnpm build`
   
   **Build output directory**: `dist`
   
   **Root directory**: `/`（留空）
   
   **Environment variables**:
   - `NODE_VERSION`: `22`
   - `PNPM_VERSION`: `10`

6. 点击 **Save and Deploy**

### 4. 等待部署完成

首次部署需要 2-3 分钟，完成后会得到一个 Cloudflare 域名：
`https://adougebabi-github-io.pages.dev`

---

## 🌐 自定义域名（可选）

如果主人有自己的域名，可以绑定：

1. 在 Cloudflare Pages 项目中，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如 `blog.example.com`）
4. 按照提示添加 DNS 记录

---

## 🔄 自动部署

配置完成后，每次推送代码到 `main` 分支，Cloudflare 会自动：
1. 拉取最新代码
2. 安装依赖（pnpm）
3. 构建网站
4. 部署到全球 CDN

---

## 📝 日常更新流程

### 添加新文章

```bash
# 1. 在 src/content/blog/ 创建新文章
# 2. 提交并推送
git add .
git commit -m "feat: 添加新文章"
git push

# 3. Cloudflare 自动部署（约 1-2 分钟）
```

---

## 🛠️ 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
# 访问 http://localhost:4321

# 本地构建测试
pnpm build
pnpm preview
```

---

## ⚡ Cloudflare Pages 优势

- ✅ **全球 CDN**：自动分发到 300+ 数据中心
- ✅ **国内访问快**：比 GitHub Pages 快 3-5 倍
- ✅ **无限带宽**：完全免费
- ✅ **自动 HTTPS**：免费 SSL 证书
- ✅ **构建速度快**：平均 1-2 分钟完成部署
- ✅ **预览部署**：每个 PR 自动生成预览链接

---

## 🔧 高级配置

### 环境变量

如果需要配置环境变量（如评论系统、分析工具）：

1. 进入 Cloudflare Pages 项目
2. **Settings** → **Environment variables**
3. 添加变量（如 `GISCUS_REPO`）

### 构建优化

项目已配置：
- ✅ Pagefind 搜索索引（自动生成）
- ✅ 图片优化（Astro 自动处理）
- ✅ CSS/JS 压缩（生产构建自动启用）

---

## 📊 部署状态查看

访问 Cloudflare Pages 项目页面可以看到：
- 部署历史
- 构建日志
- 访问统计
- 性能指标

---

## ❓ 常见问题

### Q: 部署失败怎么办？
A: 查看 Cloudflare 构建日志，常见原因：
- Node.js 版本不匹配（确保设置 `NODE_VERSION=22`）
- 依赖安装失败（检查 `pnpm-lock.yaml`）

### Q: 如何回滚到之前的版本？
A: Cloudflare Pages 保留所有部署历史，可以一键回滚

### Q: 可以同时使用 GitHub Pages 吗？
A: 可以，但不推荐。Cloudflare Pages 已经足够好了

---

## 🎉 完成！

配置完成后，博客将在以下地址访问：
- **Cloudflare 域名**: `https://adougebabi-github-io.pages.dev`
- **自定义域名**（如果配置）: `https://your-domain.com`

浮浮酱的配置完成啦～主人可以开始写博客了喵！ฅ'ω'ฅ
