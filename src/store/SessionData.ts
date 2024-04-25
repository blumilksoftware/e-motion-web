import { createStore } from 'vuex'
import { defaultLocale } from '@/locales/LocaleIndex.js'
import { getCookie } from '../cookies/getCookie.js'
import { setCookie } from '../cookies/setCookie.js'

interface state {
  locale: string
}
const store = createStore({
  state: {
    locale: getCookie('locale') || defaultLocale,
  },
  mutations: {
    setLocale(state: state, locale: string) {
      state.locale = locale
      setCookie('locale', locale, 30)
    },
  },
  actions: {},
  getters: {},
})
export default store
