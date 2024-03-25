import { createStore } from "vuex";
import { defaultLocale } from "@/locales";

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Helper function to get a cookie
function getCookie(name: string | string[]) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

// Define your Vuex store here
const store = createStore({
  state: {
    locale: getCookie("locale") || defaultLocale, // Initialize locale from cookie or default to 'en'
  },
  mutations: {
    setLocale(state, locale) {
      state.locale = locale;
      // Set the locale in a cookie to make it persistent
      setCookie("locale", locale, 30); // Cookie expires in 30 days
    },
  },
  actions: {},
  getters: {},
});
export default store;
