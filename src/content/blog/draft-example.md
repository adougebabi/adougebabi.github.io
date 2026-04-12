---
title: 建立一篇草稿文章
description: 有時候你可能想先撰寫一篇草稿文章，這樣你就可以在開發環境中預覽它，而不會意外發布到生產環境。以下是如何在 SHBlog Next 中建立一篇草稿文章的指南。
pubDate: 2025-12-28T03:56:51.357Z
heroImage: ../../assets/blog-placeholder-3.jpg
tags:
  - 測試
  - draft
category: ["範例分類"]
draft: true
---

這是一篇草稿文章，只會在開發環境（`nr dev`）中可見。

在生產環境（`nr build` + `nr preview`）中，這篇文章不會被編譯和顯示。

![Image Example](../../assets/blog-placeholder-3.jpg)

## 如何使用

在文章的 frontmatter 中設置 `draft` 屬性：

- `draft: true` - 文章只在開發環境可見
- `draft: false` 或不設置 - 文章在所有環境可見

這樣你就可以在開發時預覽草稿，而不會意外發布到生產環境。
