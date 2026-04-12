# Configuring SHBlog Next by yourself

This is a guide for contributing translations to the configuration files of this project. If you want to help translate the configuration files into different languages, please follow the instructions below.

## Basic configuration

### `title`

The title of the configuration section. This should be a concise and clear description of what the configuration is about.

### `description`

A brief description of the configuration. This should provide an overview of the purpose and functionality of the configuration.

### `lang` and `siteLang`

`lang` is the language what you want to use in website, for example, it will be used in `<html lang="zh-TW">` and time format, and others.

`siteLang` is the language code used for the i18n system in the project. It should be consistent with the `lang` value, in most cases it will same as `lang`, but sometimes it will be in a different format (e.g., "zh-TW" vs "zh_tw"). This is used internally for loading the correct language resources.

### `favicon`

The URL of the favicon for the website. This should be a path to an image file that represents the site icon.

> [!NOTE]
> We suggests you don't edit it. If you want to change the favicon, the best way is to replace the file at `public/favicon.png` with your own image.

---

## `pages` configuration (`pages`)

The `pages` configuration defines the content and structure of different pages on the website, such as the homepage, blog page, and other static pages. Each page can have its own title, subtitle, hero image, and other specific settings.

### `home` page configuration (`pages.home`)

- `title`: The quote or slogan displayed on the homepage. This should be a catchy and engaging phrase that represents the essence of the blog.
- `heroImage`: The URL of the hero image displayed on the homepage. This should be a visually appealing image that captures the attention of visitors.

> [!NOTE]
> Make sure to provide a high-quality image that aligns with the overall design and theme of your blog.
>
> We suggests you use an image with a resolution of at least 1200x600 pixels for the hero image to ensure it looks good on various screen sizes.

- `greetings`: An array of greeting messages that change based on the time of day.

> [!IMPORTANT]
> The `greetings` array should be ordered by time, with the first greeting having the earliest `begin` time and the last greeting having the latest `finish` time.
> Each greeting object should have a `begin` time (in hours), a `finish` time (in hours), and a `text` message. The system will display the appropriate greeting based on the current time.
> For example, a greeting with `begin: 0` and `finish: 6` will be shown from midnight to 6 AM, while a greeting with `begin: 6` and `finish: 12` will be shown from 6 AM to noon.
>
> Make sure to cover the entire 24-hour period with your greetings to provide a personalized experience for visitors at any time of day.

### `blog` page configuration (`pages.blog`)

- `title`: The title of the blog page. This should clearly indicate that this page contains the list of blog posts.
- `subTitle`: A brief description or subtitle for the blog page. This should provide additional context about the content of the blog and encourage visitors to explore the posts.
- `heroImage`: The URL of the hero image displayed on the blog page. This should be an image that complements the theme of the blog and enhances the visual appeal of the page.

### Other static pages configuration (`pages.other`)

The `pages.other` configuration allows you to define settings for other static pages on your website, such as the search page, friends page, and about page. Each of these pages can have its own title, subtitle, and hero image.

- `search`: Configuration for the search page.
  - `title`: The title of the search page. This should indicate that this page is for searching content on the site.
  - `subTitle`: A brief description or subtitle for the search page. This should encourage visitors to use the search functionality to find content they are interested in.
  - `heroImage`: The URL of the hero image displayed on the search page. This should be an image that complements the theme of the search page and enhances its visual appeal.

- `friends`: Configuration for the friends page.
  - `title`: The title of the friends page. This should indicate that this page is for viewing friend links.
  - `subTitle`: A brief description or subtitle for the friends page. This should provide context about the purpose of the friends page.
  - `heroImage`: The URL of the hero image displayed on the friends page. This should be an image that complements the theme of the friends page and enhances its visual appeal.

- `about`: Configuration for the about page.
  - `title`: The title of the about page. This should indicate that this page is for providing information about the website or its author.
  - `subTitle`: A brief description or subtitle for the about page. This should provide a brief overview of the content covered on this page.
  - `heroImage`: The URL of the hero image displayed on the about page. This should be an image that complements the theme of the about page and enhances its visual appeal.

---

## `style` configuration (`style`)

The `style` configuration defines the visual appearance and layout of the website. It includes settings for the hero image, default post image, number of posts per page, title separator, and other style-related options.

### `heroImage` configuration (`style.heroImage`)

- `from`, `to`: In this project, hero section have a gradient overlay effect that changes as the user scrolls down the page.

  The `from` and `to` properties define the scroll positions (in pixels) where this effect starts and ends.

  The `from` value indicates the scroll position where the hero image effect begins, while the `to` value indicates where it ends.

  For example, if `from` is set to 60 and `to` is set to 100, the hero image effect will start when the user scrolls down 60 pixels and will end when they scroll down 100 pixels. This allows for a smooth transition of the hero image as users navigate through the page.

- `src`: The URL of the hero image used for the homepage. This should be a visually appealing image that represents the theme of your blog.

- ~~`method`~~: The method used to display the hero image. This can be set to "overlay" for a gradient overlay effect or "mask" for a masked effect. Choose the method that best suits the design of your website.

  (This config option is deprecated and will be removed in future versions.)

### `defaultPostImage` (`style.defaultPostImage`)

If user doesn't set a featured image for a blog post, the system will use the image specified in `defaultPostImage` as a fallback. This ensures that all posts have a visually appealing image, even if the author forgets to set one.

### `postsPerPage` (`style.postsPerPage`)

This option defines how many blog posts are displayed on each page of the post list in main page. Setting this to a reasonable number (e.g., 10) can improve page load times and provide a better user experience by not overwhelming visitors with too many posts at once.

### `titleSeparator` (`style.titleSeparator`)

The `titleSeparator` is a character or string used to separate the post title and the site name in the browser tab and SEO metadata. For example, if you set `titleSeparator` to "-", a post titled "My First Post" on a site named "My Blog" would appear in the browser tab as "My First Post - My Blog". You can choose any separator that fits your site's style, such as "|", "•", or even an emoji.

### ~~`enableTransitions`~~ (`style.enableTransitions`)

This option determines whether to enable page transition animations when navigating between different pages on the website.

It was deprecated and going to be removed in future versions, as SHBN is default enabling page transitions and there is no plan to support disabling it, if you want to disable page transitions, you can remove the transition styles in the CSS file or override the styles in your own stylesheet. However, disabling page transitions may lead to issue in some cases including but not limited to:

- Flash of unstyled content (FOUC) when navigating between pages
- Built-in components's behavior may be affected (Because of its event is referred to the transition state.)

### `enableRecentPosts` (`style.enableRecentPosts`)

Enable or disable the recent posts section on the homepage like below:

![Recent Posts Section Example](/docs/assets/config_docs/style.enableRecentPosts_1.png)

---

## `author` configuration (`author`)

The `author` configuration defines the information about the author of the blog, including their name, bio, contact information, avatar, and social media links.

![Author Card Example](/docs/assets/config_docs/author_1.png)

### `name` (`author.name`)

The name of the author or site owner. This should be a recognizable name that visitors can associate with the content of the blog.

### `bio` (`author.bio`)

A brief biography or description of the author. This should provide visitors with some background information about the author and their interests.

### `email` (`author.email`)

The contact email address for the author. This allows visitors to get in touch with the author for inquiries, feedback, or collaboration opportunities.

### `avatarUrl` (`author.avatarUrl`)

The URL of the author's avatar image. This should be a clear and professional image that represents the author visually on the website.

We suggests use Gravatar for the avatar image rather than hosting it yourself, as it provides a globally recognized avatar based on the email address.

### `links` (`author.links`)

The `links` array contains the social media links for the author. Each link object should have an `icon`, a `to` URL, and a `label`. The `icon` should correspond to a supported social media platform (e.g., "Twitter", "GitHub") or be a custom icon URL. The `to` property should be the URL to the author's profile on that platform, and the `label` is used for accessibility purposes.

The icon can be found in the `simple-icons` library, which is used in the project to provide consistent and recognizable icons for various social media platforms. You can search for the appropriate icon on the [Simple Icons website](https://simpleicons.org/) and use the exact name (case-sensitive) as the `icon` value in your configuration.

---

## `navBar` configuration (`navBar`)

The `navBar` configuration defines the settings for the navigation bar at the top of the website. This includes the links that will be displayed in the navigation menu, as well as their titles, URLs, and icons.

### `links` (`navBar.links`)

The `title` will be displayed in the navigation menu, while the `icon` will be used for the mobile menu. The URL can be an internal link (relative path), an external link (absolute URL), or a link to a specific section of the site.

| Mobile Menu                                           | Desktop Menu                                           |
| ----------------------------------------------------- | ------------------------------------------------------ |
| ![Mobile Menu](/docs/assets/config_docs/navBar_2.png) | ![Desktop Menu](/docs/assets/config_docs/navBar_1.png) |

| Key     | Description                                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `title` | The text that will be displayed for the navigation link. This should be concise and descriptive                                             |
| `url`   | The URL that the navigation link points to. This can be an internal link (e.g., "/blog") or an external link (e.g., "https://example.com"). |
| `icon`  | The name of the icon to be displayed in the mobile menu. This should correspond to an icon from the `lucide-react` library.                 |

> [!NOTE]
> Make sure to use icons from the `lucide-react` library for the navigation links, as these icons are optimized for web use and will ensure a consistent look across different devices and screen sizes. You can find the available icons in the [Lucide Icons documentation](https://lucide.dev/).

---

## `friendLinks` configuration (`friendLinks`)

The `friendLinks` configuration defines the settings for the friend links section of the website. This section is typically used to display links to other websites or blogs that the author wants to recommend to their visitors. Each friend link can include a title, an image URL, a description, the site URL, and optional tags for categorization. This allows the author to share resources and connect with other content creators in their niche, providing additional value to their audience and fostering a sense of community.

![Friend Links Section Example](/docs/assets/config_docs/friendLinks_1.png)

| Key       | Description                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`   | The name of the website being linked to. This should be a clear and concise name that represents the linked site.                                                           |
| `imgUrl`  | The URL of the image representing the linked website. This should be a visually appealing image that captures the essence of the linked site.                               |
| `desc`    | A brief description of the linked website. This should provide visitors with an overview of what the linked site is about and why it is being recommended.                  |
| `siteUrl` | The URL of the linked website. This should be a working URL that directs visitors to the recommended site. Make sure to include the full URL (e.g., "https://example.com"). |
| `tags`    | Optional tags for categorizing or describing the linked website, which can help visitors understand the nature of the linked site and why it is being recommended.          |

---

## `behavior` configuration (`behavior`)

The `behavior` configuration defines the settings for various interactive features and functionalities of the website, such as comments, analytics, 404 page behavior, table of contents, and more. This section allows you to customize how users interact with your site and enhance their overall experience.

### `commentConfig` (`behavior.commentConfig`)

The `commentConfig` defines the settings for the comment system used on the blog posts. It includes options for enabling comments, choosing a comment platform or disable it, and configuring the specific settings for each platform. This allows you to engage with your readers and foster a sense of community around your content.

**Giscus**

Giscus is a comment system powered by GitHub Discussions. It allows you to use GitHub as a backend for your comments, providing features like authentication, moderation, and integration with your GitHub repository. To use Giscus, you need to set `enableComment` to `Giscus` and provide the necessary configuration settings such as repository information and mapping strategy.

When using Giscus, you should get the required configuration values from the Giscus website by using [their configuration generator](https://giscus.app/). This will ensure that you have the correct repository information and settings for your comment system to work properly.

After you get Giscus configuration values, you can fill in the `giscusConfig` object in your configuration file with the corresponding values. All the configuration options you got from Giscus's key name is same as there.

**Utterances**

Utterances is another comment system that also uses GitHub Issues as a backend. It provides a simple and lightweight commenting solution that can be easily integrated into your blog. To use Utterances, you need to set `enableComment` to `Utterances` and provide the required configuration settings such as repository information and issue term.

When using Utterances, you should get the required configuration values from the Utterances website by using [their configuration generator](https://utteranc.es/). This will ensure that you have the correct repository information and settings for your comment system to work properly.

Surely, after you get Utterances configuration values, you can fill in the `utterancesConfig` object in your configuration file with the corresponding values. All the configuration options you got from Utterances's key name is same as there.

**Disable Comments**

If you prefer not to have a comment system on your blog, you can simply set `enableComment` to `None`. This will disable the comment functionality across your site, providing a cleaner and more streamlined experience for visitors who may not be interested in leaving comments.

### Google Tag Manager config (`behavior.enableGTM` and `behavior.gtmConfig`)

The `enableGTM` option allows you to enable or disable Google Tag Manager (GTM) for your website. GTM is a powerful tool that allows you to manage and deploy marketing tags (snippets of code or tracking pixels) on your website without having to modify the code directly. By enabling GTM, you can easily add and update tags for analytics, advertising, and other purposes through the GTM interface.

If you choose to enable GTM by setting `enableGTM` to `true`, you will need to provide the necessary configuration settings in the `gtmConfig` object. This typically includes your Google Tag Manager ID, which is a unique identifier for your GTM container. You can find this ID in your GTM account dashboard. Once you have entered your GTM ID in the configuration, the necessary GTM scripts will be included in your website, allowing you to manage your tags effectively through the GTM platform.

### 404 Page Easter Egg (`behavior.enable404EasterEgg`)

The `enable404EasterEgg` option allows you to enable or disable a fun and interactive Easter egg on your website's 404 error page. When this option is set to `true`, visitors who visited some certain URL that doesn't exist on your site will be treated with a special surprise or interactive element. You can learn more in `src/pages/404.astro`.

### Table of Contents configuration (`behavior.tableOfContents`)

The `tableOfContents` configuration defines the settings for the table of contents (TOC) feature on your blog posts. This feature allows you to automatically generate a table of contents based on the headings in your blog post, making it easier for readers to navigate through long articles.

- **`enable`**: Whether to display the table of contents on article pages. Setting this to `true` will enable the TOC, while setting it to `false` will disable it.
- **`minDepth`**: The minimum heading depth to include in the table of contents. For example, setting this to `2` means that only the page have two or more levels of headings (e.g., h2, h3, etc.) will have a TOC generated. If a post only contains h1 headings, the TOC will not be displayed.
- **`maxDepth`**: The maximum heading depth to include in the table of contents. For example, setting this to `4` means that headings up to h4 will be included in the TOC, while headings deeper than h4 (e.g., h5, h6) will be excluded. Setting this to `-1` will include all heading levels in the TOC.

### Pangu.js Chinese Auto-spacing configuration (`behavior.panguJs`)

At present version, this feature's toggle has already been moved to `astro.config.mjs` since it is a plugin-level configuration, if you want to enable or disable it, please go to that file to modify the configuration.

```javascript
// astro.config.mjs
export default defineConfig({
  // existing configuration ...

  markdown: {
    // existing configuration ...

    rehypePlugins: [
      // existing configuration ...
      rehypeCodeBlock,
      rehypePangu, // This is the plugin for Pangu.js Chinese auto-spacing feature. It will automatically add spaces between Chinese characters and English words or numbers to improve readability.
      rehypeKatex,
    ],
  },
});
```

If you don't need Pangu.js, remove `rehypePangu` from the `markdown.rehypePlugins` array in your `astro.config.mjs` file to disable this feature. Disabling Pangu.js can reduce the build time of your website, especially if you have a large amount of content with mixed Chinese and English text.

### RSS configuration (`behavior.rss`)

The `rss` configuration defines the settings for the RSS feed of your blog. RSS (Really Simple Syndication) is a format for delivering regularly changing web content, allowing your readers to subscribe to updates from your blog using an RSS reader.

- **`enable`**: Whether to enable the RSS feed for your blog. Setting this to `true` will generate an RSS feed that readers can subscribe to, while setting it to `false` will disable the RSS feed.
- **`protectContent`**: Whether to protect the content of your blog posts in the RSS feed. If this is set to `true`, only a summary or excerpt of each post will be included in the RSS feed, rather than the full content. This can help prevent unauthorized scraping of your content while still allowing readers to get an overview of your posts.
- **`enableStylesheet`**: Whether to provide an XSLT stylesheet for the RSS feed to improve the reading experience when viewed in a web browser. Setting this to `true` will include a stylesheet that formats the RSS feed for better readability, while setting it to `false` will provide a plain XML feed without any styling.

> [!NOTE]
> If you enabled `protectContent`, your RSS feed will only include the first 50 letters (If you use English or latin characters) or first 50 text if you are using Chinese characters of your posts, and readers will need to visit your website to read the full content. This can help protect your content from being scraped by bots or unauthorized users while still allowing readers to stay updated with your latest posts through the RSS feed.

---

## `footer` configuration (`footer`)

The `footer` configuration defines the settings for the footer section of your website. The footer is typically located at the bottom of each page and can include various elements such as a description, social media links, copyright information, and more. This section allows you to customize the content and appearance of your website's footer to provide additional information and resources to your visitors.

![Footer Section Example](/docs/assets/config_docs/footer_1.png)

### `description` (`footer.description`)

The `description` is a text that will be displayed in the footer section of your website. It can be used to provide a brief introduction or message to your visitors. The description supports multiple lines, allowing you to format it as needed. You can use this space to share a welcoming message, a brief bio, or any other information you want to convey to your audience.

### `links` (`footer.links`)

The `links` array contains the social media links that will be displayed in the footer section of your website.

- `socialMedia`: The name of the social media platform. This should correspond to a supported platform in the `simple-icons` library, which is used to display the appropriate icon for each link. You can find the available icons on the [Simple Icons website](https://simpleicons.org/). Make sure to use the exact name (case-sensitive) of the social media platform as it appears in the Simple Icons library.

  If you want to use a custom icon that is not available in the Simple Icons library, you can provide the complete URL or a relative path to the icon image in your project. For example, you could use a custom icon by setting `socialMedia` to `/assets/logo/social_media/custom_icon.svg` and providing the corresponding URL for the link.

- `url`: The URL that the social media link points to. This should be a working URL that directs visitors to your profile on the respective social media platform. Make sure to include the full URL (e.g., "https://twitter.com/yourprofile") to ensure that the links work correctly.

### `copyright` (`footer.copyright`)

The `copyright` configuration defines the settings for the copyright information displayed in the footer of your website. This typically includes the copyright text, a URL for more information about the copyright, and a strategy for updating the copyright year.

![Copyright Information Example](/docs/assets/config_docs/footer.copyright_1.png)

- `text`: The license you want to use, such as "CC BY-NC 4.0", "MIT License", "GPL v3", etc. This text will be displayed in the footer to indicate the copyright status of your content.
- `url`: The URL that provides more information about the copyright license you are using. This should be a link to the official page of the license (e.g., "https://creativecommons.org/licenses/by-nc/4.0/" for CC BY-NC 4.0) where visitors can learn more about the terms and conditions of the license.\
- `yearUpdateStrategy`: The strategy for updating the copyright year. Below are the possible values for this option:
  - `auto`: Automatically update the copyright year to the current year via JavaScript. Every time a visitor accesses your website, the script will check the current year and update the copyright year in the footer accordingly. This ensures that your copyright information is always up to date without requiring manual changes to your configuration.
  - `fixed`: Use a fixed year for the copyright. This means that the copyright year will be set to the year when you compile your website and will not change automatically. If you choose this option, build your website in 2023, the copyright year will be set to 2023 and will remain the same until you manually update it in your configuration file.
  - You can also directly set the copyright year by filling in the year number (e.g., `2023`) instead of using `auto` or `fixed`. This will set the copyright year to the specified number and it will not change automatically.
- `countryEmoji`: The emoji representing the country you are from or the country your blog is associated with. This can be a flag emoji (e.g., 🇹🇼 for Taiwan) or any other emoji that you feel represents your location or identity. This emoji will be displayed in the footer alongside the copyright information, adding a personal touch to your website.
