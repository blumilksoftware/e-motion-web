import { createStore } from 'vuex'
import { defaultLocale } from '@/locales/LocaleIndex.js'
import { getCookie } from '../cookies/getCookie.js'
import { setCookie } from '../cookies/setCookie.js'

interface state {
  locale: string
  auth:{
    token: string | null
    isAdmin: boolean
    isAuth: boolean
  }
}
const store = createStore({
  state: {
    locale: getCookie('locale') || (defaultLocale as string),
    auth: {
      token: null,
      isAdmin: false,
      isAuth: false
    }
  },
  mutations: {
    setLocale(state: state, locale: string) {
      state.locale = locale
      setCookie('locale', locale, 30)
    },
    logout(state: state) {
      state.auth.token = null
      state.auth.isAdmin = false
    },
    login(state: state, response: { [key: string]: string }) {
      state.auth.token = response['access_token']
      state.auth.isAdmin = response['0'].toString().includes('HasAdminRole')? true : false;
      state.auth.isAuth = true
    },
  },
  actions: {},
  getters: {}
})
export default store
