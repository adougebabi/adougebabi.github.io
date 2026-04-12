# Translating SHBlog Next

SHBlog Next supports multiple languages, and we welcome contributions to help translate the documentation and website content into different languages. If you're interested in contributing to the translation efforts, please refer to the following guidelines:

## Where to Translate

There is some content that can be translated, and everything essential was placed in `src/i18n`. Below are the key files and directories related to translation:

- `src/i18n/i18nKey.ts`: This file contains the keys used for internationalization (i18n). Each key corresponds to a specific piece of text in the application that can be translated.
- `src/i18n/translation.ts`: All the logic handling translations is implemented in this file. It includes functions to retrieve the appropriate translation based on the current language setting.
- `src/i18n/languages/`: This directory contains the actual translation files for each supported language. Each file is named according to the language code (e.g., `en.ts` for English, `zh_TW.ts` for Chinese (Taiwan)) and contains key-value pairs where the key corresponds to the i18n keys defined in `i18nKey.ts`, and the value is the translated text.

## How to Contribute to Translations

1. **Fork the Repository**: Start by forking the repository to your own GitHub account.
2. **Clone the Forked Repository**: Clone your forked repository to your local machine using:
   ```bash
   git clone <YOUR_FORKED_REPO_URL>
   ```
3. **Create a New Branch**: Checkout to a new branch or keep in the `dev` branch if you prefer. Whatever is convenient for you.
4. **Add Your Translations**: If you're adding a new language, create a new file in the `src/i18n/languages/` directory with the appropriate language code as the filename (e.g., `es.ts` for Spanish).

   If you're updating an existing translation, simply edit the corresponding file in the `languages` directory. Make sure to follow the format of key-value pairs, where the key is the same as defined in `i18nKey.ts` and the value is the translated text in the target language.

5. **Commit Your Changes**: Commit your changes with a descriptive message, if you can, please follow the rule in [CONTRIBUTING.md](CONTRIBUTING.md) to make the commit message more clear and consistent.
   ```bash
   git commit -m "i18n(lang): Add [Language] translations for the website content"
   ```
6. **Push to Your Forked Repository**: Push your changes to your forked repository:
   ```bash
   git push origin <YOUR_BRANCH_NAME>
   ```
7. **Config `translation.ts`**: Update the `translation.ts` file to include the new language in the list of supported languages. If you don't know how to do it, you can refer to the guide below.
8. **Create a Pull Request**: Go to the original repository and [create a pull request](https://github.com/510208/sh-blog-next/pulls) from your forked repository's branch.
9. **Review and Merge**: The maintainers will review your pull request, provide feedback if necessary, and merge it into the main codebase once it's approved.

> [!NOTE]
> Please ensure that your translations are accurate and culturally appropriate. If you have any questions or need assistance with the translation process, feel free to reach out to the maintainers.

> [!IMPORTANT]
> If you can, please check whether the translation you want to contribute works properly in the application.
>
> You can run the application locally and switch to the language (Config it in `shblog.config.ts`) you are translating to see if the translations are displayed correctly.

## i18n Key Naming Conventions

When adding new keys to `i18nKey.ts`, please follow these naming conventions to maintain consistency:

- Use lowercase letters and separate words with underscores (e.g., `home_title`, `blog_post_date`).
- Group related keys together (e.g., all keys related to the home page should be prefixed with `home_`).
- Avoid using special characters or spaces in the keys.
- Ensure that the keys are descriptive and clearly indicate the purpose of the text they represent.
- When adding new keys, also remember to update the corresponding translation files in the `languages` directory to include translations for the new keys.
- When you create a new key, please also add it to the `i18nKey.ts` file and provide a default value in the same file for the default language (At there should be English).

## Config `translation.ts`

```typescript
import config from "@shConfig";
import type I18nKey from "./i18nKey";

// Import translations for supported languages
import { en } from "./languages/en.ts";
import { zh_TW } from "./languages/zh_TW.ts";

export type Translation = {
  [K in I18nKey]: string;
};

const defaultTranslation = en;

// Config your language map here, the key should be the language code in lowercase, and the value should be the corresponding translation object.
const map: { [key: string]: Translation } = {
  // 建立語言代碼與翻譯檔的對應關係
  en: en,
  zh_tw: zh_TW,
};

// ... existing code ...

export default function i18n(
  key: I18nKey,
  params?: Record<string, string | number>,
): string {
  const lang = config.siteLang || "zh_TW";
  let translation = getTranslation(lang, key);

  // 如果有傳入參數，則進行取代
  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      // 取代 {key} 為實際數值
      translation = translation.replace(
        new RegExp(`{${paramKey}}`, "g"),
        String(value),
      );
    });
  }

  return translation;
}
```

First, import your translation file at the top of `translation.ts`. For example, if you're adding Spanish translations, you would add:

```typescript
import { es } from "./languages/es.ts";
```

In the `map` object, add a new entry for your language, where the key is the language code in lowercase (e.g., `es` for Spanish) and the value is the imported translation object for that language (e.g., `es`).

For example, if you're adding Spanish translations, you would add:

```typescript
const map: { [key: string]: Translation } = {
  // Existing language mappings
  en: en,
  zh_tw: zh_TW,

  // Add your new language mapping here
  es: es,
};
```

After updating the `translation.ts` file, make sure to commit your changes and push them to your forked repository before creating a pull request.

If you want to contribute the i18n system itself, please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) for more details on how to contribute to the codebase. If you don't like this, never edit the other place in `translation.ts` that is not related to the language map, it may cause unexpected issues.

If you want to add new features to the i18n system, please create a new issue or discuss it with the maintainers before implementing it.
