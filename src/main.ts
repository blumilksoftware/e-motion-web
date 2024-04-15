import { createApp } from 'vue'
import App from '@/layouts/NavDefault.vue'
import router from './router/index.js'
import store from './store/SessionData.js'
import './index.css'
import { messages, defaultLocale } from '@/locales/LocaleIndex.js'
import { createI18n } from 'vue-i18n'
import { getCookie } from './cookies/getCookie'
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const i18n = createI18n({
  messages,
  locale: getCookie('locale') || defaultLocale
})

createApp(App)
  .use(store)
  .use(router)
  .use(Vue3Toasity, {
    autoClose: 3000
    // ... other options
  } as ToastContainerOptions)
  .use(i18n)
  .mount('#app')
