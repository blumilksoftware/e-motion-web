import { createI18n } from "vue-i18n";
import pl from "./locales/pl.json";
import en from "./locales/en.json";

function loadLocaleMessages() {
  const locales: { [key: string]: any }[] = [{ pl: pl }, { en: en }];
  const messages: { [key: string]: any } = {}; // Add index signature
  locales.forEach((locale) => {
    const key = Object.keys(locale)[0];
    messages[key] = locale[key];
  });
  return messages;
}

export default createI18n({
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
});
