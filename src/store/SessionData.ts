import { createStore } from 'vuex'
import { defaultLocale } from '@/locales/LocaleIndex.js'
import { getCookie } from '../cookies/getCookie.js'
import { setCookie } from '../cookies/setCookie.js'

interface state {
  locale: string
  auth:{
    token: string | null
    isAdmin: boolean
    isSuperAdmin: boolean
    isAuth: boolean,
    cities: {
      noCoords: number,
      noCountry: number
    }
  }
}
const store = createStore({
  state: {
    locale: getCookie('locale') || (defaultLocale as string),
    auth: {
      token: null,
      isAdmin: false,
      isSuperAdmin: false,
      isAuth: false,
      cities: {
        noCoords: 0,
        noCountry: 0
      }
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
      state.auth.isSuperAdmin = false
      state.auth.isAuth = false
      setCookie('token', '', 0)
      setCookie('isAdmin', '', 0)
      setCookie('isSuperAdmin', '', 0)
      setCookie('isAuth', '', 0)
    },
    login(state: state, response: { [key: string]: string }) {
      if (response['access_token'] !== undefined) {
        state.auth.token = response['access_token']
        state.auth.isAdmin = response['0'].toString().includes('HasAdminRole') ? true : false
        state.auth.isAuth = true
        setCookie('token', response['access_token'], 1)
        setCookie('isAdmin', state.auth.isAdmin.toString(), 1)
        setCookie('isAuth', 'true', 1)
      }
    },
    restore(state: state) {
      state.auth.token = getCookie('token')
      state.auth.isAdmin = getCookie('isAdmin') === 'true' ? true : false
      state.auth.isAuth = getCookie('isAuth') === 'true' ? true : false
    },
    setCities(state: state, payload: { citiesNoCoords: number; citiesNoCountry: number }) {
      state.auth.cities.noCoords = payload.citiesNoCoords
      state.auth.cities.noCountry = payload.citiesNoCountry
    }
  },
  actions: {},
  getters: {}
})
export default store
