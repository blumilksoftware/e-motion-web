import { createStore } from "vuex";
import { defaultLocale } from "@/locales";
import { getCookie } from "../cookies/getCookie";
import { setCookie } from "../cookies/setCookie";

type state = {
  locale: string;
};
// Define your Vuex store here
const store = createStore({
  state: {
    locale: getCookie("locale") || defaultLocale, // Initialize locale from cookie or default to 'en'
  },
  mutations: {
    setLocale(state: state, locale: string) { // Update the type of 'state' parameter
      state.locale = locale;
      // Set the locale in a cookie to make it persistent
      setCookie("locale", locale, 30); // Cookie expires in 30 days
    },
  },
  actions: {},
  getters: {},
});
export default store;
