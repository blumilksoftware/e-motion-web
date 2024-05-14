import { createStore } from 'vuex'

interface state {
  citiesWithProviders: {
    cities: any[]
    providers: any[]
    countries: any[]
  }
  dataIsFetched: boolean
  selectedCity: any
  selectedCountry: any
  selectedProviderName: string
}
const fStore = createStore({
  state: {
    citiesWithProviders: {
      cities: [],
      providers: [],
      countries: [],
    },
    dataIsFetched: false,
    selectedCity: null,
    selectedCountry: null,
    selectedProviderName: null,
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
    },
  },
  actions: {},
  getters: {},
})

export default fStore
