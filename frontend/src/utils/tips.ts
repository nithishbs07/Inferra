import { I18nKey } from "#/i18n/declaration";

export interface Tip {
  key: I18nKey;
  link?: string;
}

export const TIPS: Tip[] = [
  { key: I18nKey.TIPS$CUSTOMIZE_MICROAGENT },
  { key: I18nKey.TIPS$SETUP_SCRIPT },
  { key: I18nKey.TIPS$VSCODE_INSTANCE },
  { key: I18nKey.TIPS$SAVE_WORK },
  { key: I18nKey.TIPS$SPECIFY_FILES },
  { key: I18nKey.TIPS$HEADLESS_MODE },
  { key: I18nKey.TIPS$CLI_MODE },
  { key: I18nKey.TIPS$GITHUB_HOOK },
  {
    key: I18nKey.TIPS$BLOG_SIGNUP,
    link: "https://www.all-hands.dev/blog",
  },
  { key: I18nKey.TIPS$API_USAGE },
];

export function getRandomTip(): Tip {
  const randomIndex = Math.floor(Math.random() * TIPS.length);
  return TIPS[randomIndex];
}
