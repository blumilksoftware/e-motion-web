import { createApp } from 'vue'
import App from '@/layouts/NavDefault.vue'
import router from './router/index.js'
import store from "./store/SessionData.js";
import fStore from './store/FilterStore.js'
import './index.css'
import { messages, defaultLocale } from '@/locales/LocaleIndex.js'
import { createI18n } from 'vue-i18n'
import { getCookie } from './cookies/getCookie'
// import Toast from "vue-toastification";

const i18n = createI18n({
  messages,
  locale: getCookie('locale') || defaultLocale,
})

createApp(App)
  .use(fStore)
  .use(store)
  .use(router)
  // .use(Toast, {
  //   position: 'top-right',
  //   timeout: 2000,
  //   closeOnClick: true,
  //   pauseOnFocusLoss: false,
  //   pauseOnHover: true,
  //   draggable: true,
  //   draggablePercent: 0.6,
  //   showCloseButtonOnHover: false,
  //   hideProgressBar: true,
  //   closeButton: 'button',
  //   icon: true,
  //   rtl: false,
  //   transition: 'Vue-Toastification__bounce',
  //   maxToasts: 10,
  //   newestOnTop: true,
  //   filterBeforeCreate: (toast, toasts) => {
  //     if (toasts.filter((t) => t.type === toast.type).length !== 0) {
  //       return false
  //     }

  //     return toast
  //   }
  // })
  .use(i18n)
  .mount('#app')
