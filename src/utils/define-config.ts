import { Newspaper, Handshake, Home, Info, Phone } from "lucide-react";
import type { ShBlogConfig } from "../types/shblog.config.d";

const defaultConfig: ShBlogConfig = {
  title: "My Open Source Blog",
  description:
    "這是一個基於 sh-blog-next 構建的現代化部落格。在這裡分享你的技術見聞與生活點滴。",

  lang: "zh-TW",
  siteLang: "zh_tw",

  favicon: "/favicon.png",

  pages: {
    // 首頁設定
    home: {
      title: "探索、學習與分享\n歡迎來到我的數位空間。",
      heroImage: "/assets/layouts/homepage/samhacker_homepage_background.webp",
      greetings: [
        { begin: 0, finish: 6, text: "深夜好，記得早點休息。" },
        { begin: 6, finish: 12, text: "早安，開啟充滿活力的一天！" },
        { begin: 12, finish: 14, text: "午安，休息一下再出發吧。" },
        { begin: 14, finish: 18, text: "下午好，喝杯咖啡放鬆心情。" },
        { begin: 18, finish: 22, text: "傍晚好，享受寧靜的夜晚。" },
        { begin: 22, finish: 24, text: "晚安，祝你有個好夢。" },
        { text: "你好，歡迎光臨！" },
      ],
    },

    blog: {
      title: "文章列表",
      subTitle: "所有的思緒與技術累積，都在這裡留下足跡。",
      heroImage: "/assets/layouts/homepage/samhacker_homepage_background.webp",
    },

    // 靜態頁面設定
    other: {
      search: {
        title: "站內搜尋",
        subTitle: "輸入關鍵字，尋找你感興趣的內容。",
        heroImage:
          "/assets/layouts/homepage/samhacker_homepage_background.webp",
      },
      friends: {
        title: "友情連結",
        subTitle: "與志同道合的朋友們交換連結，共同成長。",
        heroImage:
          "/assets/layouts/homepage/samhacker_homepage_background.webp",
      },
      about: {
        title: "關於本站",
        subTitle: "了解這個網站的建立初衷與技術架構。",
        heroImage:
          "/assets/layouts/homepage/samhacker_homepage_background.webp",
      },
    },
  },

  // 風格設定
  style: {
    heroImage: {
      from: 60,
      to: 100,
      src: "/assets/layouts/homepage/samhacker_homepage_background.webp",
      method: "overlay",
    },
    defaultPostImage:
      "/assets/layouts/homepage/samhacker_homepage_background.webp",
    postsPerPage: 10,
    titleSeparator: "|",

    /** @deprecated This option is no longer used and will be removed in future versions. Theming and transitions are always enabled by default to provide a consistent user experience. Please remove this option from your configuration. */
    enableTransitions: true, // 已標記為過時

    enableRecentPosts: true,
  },

  // 作者資訊（通用占位符）
  author: {
    name: "Demo Admin",
    bio: "這是一位熱愛技術的開發者，喜歡透過文字記錄學習過程。",
    email: "admin@example.com",
    avatarUrl:
      "https://gravatar.com/avatar/f7598bd8d4aba38d7219341f81a162fc842376b3b556b1995cbb97271d9e2915?v=1753291388000&size=256&d=initials",

    links: [
      {
        icon: "Github",
        to: "https://github.com/",
        label: "GitHub",
      },
    ],
  },

  // 頁首選單（依照要求保持原樣）
  navBar: {
    links: [
      { title: "Home", href: "/", icon: Home },
      { title: "Blog", href: "/blog", icon: Newspaper },
      { title: "About", href: "/about", icon: Info },
      { title: "Friends", href: "/friends", icon: Handshake },
      { title: "Contact", href: "https://example.com", icon: Phone },
    ],
  },

  // 友情連結設定（示範用）
  friendLinks: [
    {
      title: "範例站點",
      imgUrl: "/assets/default-avatar.png",
      desc: "這是一個友情連結的範例描述。",
      siteUrl: "https://example.com",
      tags: ["範例"],
    },
  ],

  // 其他行為設定
  behavior: {
    commentConfig: {
      enableComment: "Giscus",
      giscusConfig: {
        repo: "example/example",
        repoId: "[你的儲存庫ID]",
        category: "Announcements",
        categoryId: "[你的分類ID]",
        mapping: "og:title",
        strict: "0",
        reactionsEnabled: "1",
        emitMetadata: "1",
        inputPosition: "top",
        theme: "transparent_dark",
        lang: "zh-TW",
      },
      utterancesConfig: {
        repo: "example/example",
        issueTerm: "pathname",
        label: "comment",
        theme: "github-dark",
      },
    },

    enableGTM: false, // 預設關閉追蹤
    gtmConfig: {
      googleTagManagerId: "GTM-XXXXXXX",
    },

    enable404EasterEgg: true,

    tableOfContents: {
      enable: true,
      minDepth: 2,
      maxDepth: 4,
    },

    rss: {
      enable: true,
      protectContent: true,
      enableStylesheet: true,
    },
  },

  // 頁尾設定
  footer: {
    description:
      "感謝你的造訪。\n本站致力於提供高品質的內容分享。\n如果喜歡這裡，歡迎關注我的社交媒體。",
    links: [{ socialMedia: "Github", url: "https://github.com/" }],
    copyright: {
      text: "MIT License",
      url: "https://opensource.org/licenses/MIT",
      yearUpdateStrategy: "auto",
    },
    countryEmoji: "🌐",
  },
};

type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : T extends (infer U)[]
      ? DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeDeep<T>(base: T, override?: DeepPartial<T>): T {
  if (override === undefined) return base;

  // 陣列採用覆蓋策略：有給就整個取代，沒給就保留預設
  if (Array.isArray(base)) {
    return (override as T) ?? base;
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base;
  }

  const result: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };

  for (const key of Object.keys(override) as Array<keyof typeof override>) {
    const overrideValue = override[key];
    if (overrideValue === undefined) continue;

    const baseValue = (base as Record<string, unknown>)[key as string];
    result[key as string] = mergeDeep(baseValue, overrideValue as never);
  }

  return result as T;
}

export function defineConfig(
  config: DeepPartial<ShBlogConfig> = {},
): ShBlogConfig {
  return mergeDeep<ShBlogConfig>(defaultConfig, config);
}
