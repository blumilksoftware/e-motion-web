import { createI18n } from 'vue-i18n'
import pl from './locales/pl.json'
import en from './locales/en.json'

type i18mTypes = Record<string, any>;

function loadLocaleMessages() {
  const locales: i18mTypes[] = [{ pl: pl }, { en: en }]
  const messages: i18mTypes = {} // Add index signature
  locales.forEach((locale) => {
    const key = Object.keys(locale)[0]
    messages[key] = locale[key]
  })
  return messages
}

export default createI18n({
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
})
