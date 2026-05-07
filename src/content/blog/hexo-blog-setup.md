---
title: Hexo 博客搭建
description: 使用 Hexo 和 GitHub Pages 搭建个人博客的完整流程记录
pubDate: 2020-08-26T10:43:20.000Z
heroImage: https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200
category: ["教程"]
draft: false
tags:
  - Hexo
  - 博客搭建
---

趁现在还记得，赶紧记录一下，以免后续忘记了。

首先搭建一个个人博客需要先准备以下东西：

- 服务器（我这里是用 Github Pages，所以没准备服务器）
- hexo 的皮肤（我这个用的是 Butterfly）
- NodeJS

然后就可以弄了，流程比较简单，初始化然后部署就好了。

首先需要安装 NodeJs，我这边开发环境是 MasOS，好像默认自带，也好像后面更新过，这里就一笔带过了。

然后就安装 hexo（我这边用的一般常用 yarn 去管理，所以下面的命令都是以 yarn 为主）

![S8VmMs](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/08/26/S8VmMs.png)

> 我这里安装过，所以可能效果不一样，但流程一样

然后用`hexo -v`查看能否正确使用

![GzSfv3](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/08/26/GzSfv3.png)

> 我这里这里曾经卡了很久环境变量，具体是~/.bashrc 里面的 path 并不正确，后面执行命令
>
> `echo -e "export PATH=$(npm prefix -g)/bin:$PATH" >> ~/.bashrc && source ~/.bashrc`
>
> 重新设置 path 之后再
>
> `source ~/.bashrc`
>
> 就好了

到这里 hexo 安装完毕。

下一步就是初始化项目。

输入`hexo init`

![DdkEw3](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/08/26/DdkEw3.png)

就会从 github 里面下载初始化模板，然后输入`hexo s` 本地运行博客

> 默认好像是 4000 如果改端口可以加`-p 6666`

![bZAm9u](https://raw.giteeusercontent.com/Semiramis/oss/raw/master/2020/08/26/bZAm9u.png)

然后进入 http://localhost:4000 就可以看到博客了。

下一步就是更换皮肤，因为这一块算是 hexo 拓展功能，有空重新整理一篇文章。
