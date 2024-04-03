import { createStore } from 'vuex'

const store = createStore({
  state: {
    citiesWithProviders: {
      cities: [],
      providers: [],
      countries: []
    },
    selectedCity: null,
    selectedCountry: null,
    selectedProviderName: null
  },
  mutations: {
    saveCitiesWithProviders(state, response) {
      state.citiesWithProviders.cities = response.data.cities
      state.citiesWithProviders.providers = response.data.providers
      state.citiesWithProviders.countries = response.data.countries
    },
    changeSelectedCity(state, city) {
      state.selectedCity = city
    },
    changeSelectedCountry(state, country) {
      state.selectedCountry = country
    },
    changeSelectedProvider(state, providerName) {
      state.selectedProviderName = providerName
    }
  },
  actions: {},
  getters: {}
})

export default store;
