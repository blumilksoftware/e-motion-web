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
      console.log(response.data.cities)
      state.citiesWithProviders.cities = response.data.cities
      console.log(response.data.providers)
      state.citiesWithProviders.providers = response.data.providers
      console.log(response.data.countries)
      state.citiesWithProviders.countries = response.data.countries
    },
    changeSelectedCity(state, city) {
      console.log(city)
      state.selectedCity = city
    },
    changeSelectedCountry(state, country) {
      console.log(country)
      state.selectedCountry = country
    },
    changeSelectedProvider(state, providerName) {
      console.log(providerName)
      state.selectedProviderName = providerName
    },
  },
  actions: {},
  getters: {},
})

export default fStore
