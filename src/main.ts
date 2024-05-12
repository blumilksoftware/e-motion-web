import { createApp } from 'vue'
import App from '@/layouts/NavDefault.vue'
import router from './router/index'
import store from './store/SessionData'
import './index.css'
import { messages, defaultLocale } from '@/locales/LocaleIndex.js'
import { createI18n } from 'vue-i18n'
import { getCookie } from './cookies/getCookie'
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const apiUrl = 'https://dev.escooters.blumilk.pl'
const i18n = createI18n({
  messages,
  locale: getCookie('locale') || defaultLocale,
  legacy: false,
})

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .use(Vue3Toasity, {
    autoClose: 3000,
  } as ToastContainerOptions)
  .mount('#app')
export { i18n, apiUrl }
