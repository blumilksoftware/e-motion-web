<script setup>
import fStore from '@/store/FilterStore'
import router from '@/router/index.ts'
import { computed, onMounted, ref, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { TrashIcon, XMarkIcon, MapIcon } from '@heroicons/vue/24/outline'
import FavoriteButton from '@/components/FavoriteButton.vue'
import InfoPopup from '@/components/InfoPopup.vue'
import { FlagIcon, TruckIcon, FunnelIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { breakpointsTailwind, onClickOutside, useBreakpoints } from '@vueuse/core'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import SelectedCity from '@/components/SelectedCity.vue'
import ProviderIcons from '@/components/ProviderIcons.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import store from '@/store/SessionData'
import { reactive } from 'vue'
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = ref(breakpoints.greaterOrEqual('lg'))
const props = defineProps({
  cities: {
    type: Array,
    default: () => []
  },
  providers: {
    type: Array,
    default: () => []
  },
  countries: {
    type: Array,
    default: () => []
  },
  isAuth: {
    type: Boolean,
    default: true
  }
})
const filteredCities = computed(() => {
  const selectedCountryId = fStore.state.selectedCountry ? fStore.state.selectedCountry.id : null
  const selectedProviderName = fStore.state.selectedProviderName

  if (selectedCountryId === null && selectedProviderName === null) {
    return props.cities
  } else if (selectedCountryId !== null && selectedProviderName === null) {
    return props.cities.filter((city) => city.country.id === selectedCountryId)
  } else if (selectedCountryId === null && selectedProviderName !== null) {
    return props.cities.filter((city) =>
      city.cityProviders.some((cityProvider) => cityProvider.provider_name === selectedProviderName)
    )
  } else {
    return props.cities.filter(
      (city) =>
        city.country.id === selectedCountryId &&
        city.cityProviders.some(
          (cityProvider) => cityProvider.provider_name === selectedProviderName
        )
    )
  }
})
const filteredProviders = computed(() => {
  const selectedCountryId = fStore.state.selectedCountry ? fStore.state.selectedCountry.id : null

  if (selectedCountryId === null) {
    return props.providers
  } else {
    return props.providers.filter((provider) =>
      props.cities.some(
        (city) =>
          city.country.id === selectedCountryId &&
          city.cityProviders.some((cityProvider) => cityProvider.provider_name === provider.name)
      )
    )
  }
})
const filteredCountries = computed(() => {
  const selectedProviderName = fStore.state.selectedProviderName
  const selectedCountryId = fStore.state.selectedCountry ? fStore.state.selectedCountry.id : null
  const cityMap = new Map()

  for (const city of props.cities) {
    const cityProviders = city.cityProviders
    const hasProvider = cityProviders.some(
      (cityProvider) => cityProvider.provider_name === selectedProviderName
    )
    cityMap.set(city.country.id, cityMap.get(city.country.id) || false || hasProvider)
  }

  return props.countries.map((country) => ({
    ...country,
    hasProvider: selectedProviderName === null ? true : cityMap.get(country.id) || false,
    isSelected: country.id === selectedCountryId
  }))
})

function filterCountry(country) {
  fStore.commit('changeSelectedCity', null)

  if (fStore.state.selectedCountry && fStore.state.selectedCountry.id === country.id) {
    fStore.commit('changeSelectedCountry', null)
  } else {
    fStore.commit('changeSelectedCountry', country)
    fStore.commit('changeSelectedProvider', null)
  }
}

function filterProvider(providerName) {
  fStore.commit('changeSelectedCity', null)

  if (fStore.state.selectedProviderName === providerName) {
    fStore.commit('changeSelectedProvider', null)
  } else {
    fStore.commit('changeSelectedProvider', providerName)
  }
}

function clearFilters() {
  fStore.commit('changeSelectedProvider', null)
  fStore.commit('changeSelectedCountry', null)
  fStore.commit('changeSelectedCity', null)
}

function showCity(city) {
  console.log(city.id)
  console.log(fStore.state.selectedCity)
  if (fStore.state.selectedCity && fStore.state.selectedCity.id === city.id) {
    fStore.commit('changeSelectedCity', null)
  } else {
    fStore.commit('changeSelectedCity', city)
  }
}
const isCountryListOpened = ref(false)
const countryList = ref(null)
onClickOutside(countryList, () => (isCountryListOpened.value = false))

function toggleCountryList() {
  isCountryListOpened.value = !isCountryListOpened.value
}
const isProviderListOpened = ref(false)
const providerList = ref(null)
onClickOutside(providerList, () => (isProviderListOpened.value = false))

function toggleProviderList() {
  isProviderListOpened.value = !isProviderListOpened.value
}

function clearMap() {
  fStore.commit('changeSelectedCity', null)
}

function getProviderColor(providerName) {
  const provider = props.providers.find((provider) => provider.name === providerName)

  return provider ? provider.color : ''
}

function goToCityPage(city) {
  router.push(`/city/${city.country.slug}/${city.slug}`)
  // get(`/city?country=${city.country.slug}&city=${city.slug}`)
}
const providerAutocomplete = ref('')
const countryAutocomplete = ref('')

function rememberProviderAutocompleteValue() {
  if (fStore.state.selectedProviderName) {
    providerAutocomplete.value = fStore.state.selectedProviderName
  } else {
    providerAutocomplete.value = ''
  }
}

function rememberCountryAutocompleteValue() {
  if (fStore.state.selectedCountry) {
    countryAutocomplete.value = fStore.state.selectedCountry.name
  } else {
    countryAutocomplete.value = ''
  }
}
onMounted(() => {
  rememberProviderAutocompleteValue()
  rememberCountryAutocompleteValue()
  watch(
    () => fStore.state.selectedProviderName,
    () => {
      rememberProviderAutocompleteValue()
    }
  )
  watch(
    () => fStore.state.selectedCountry,
    () => {
      rememberCountryAutocompleteValue()
    }
  )
  watch(
    () => providerAutocomplete.value,
    () => {
      if (providerAutocomplete.value === '') {
        fStore.commit('changeSelectedProvider', null)
      }
    }
  )
  watch(
    () => countryAutocomplete.value,
    () => {
      if (countryAutocomplete.value === '') {
        fStore.commit('changeSelectedCountry', null)
      }
    }
  )
})

function clearProviderAutocompleteInput() {
  providerAutocomplete.value = ''
  toggleProviderList()
}

function clearCountryAutocompleteInput() {
  countryAutocomplete.value = ''
  toggleCountryList()
}
const filteredProviderSuggestions = computed(() => {
  return filteredProviders.value.filter((provider) =>
    provider.name.toLowerCase().includes(providerAutocomplete.value.toLowerCase())
  )
})
const filteredCountrySuggestions = computed(() => {
  return filteredCountries.value.filter((country) =>
    country.name.toLowerCase().includes(countryAutocomplete.value.toLowerCase())
  )
})

function selectProvider(provider) {
  providerAutocomplete.value = provider.name
  filterProvider(provider.name)
  toggleProviderList()
}

function selectCountry(country) {
  providerAutocomplete.value = ''
  countryAutocomplete.value = country.name
  filterCountry(country)
  toggleCountryList()
}
</script>

<template>
  <div class="mx-auto mt-4 flex w-11/12 flex-col sm:mt-12">
    <div class="px-2 lg:px-3">
      <div ref="countryList" class="relative">
        <div class="cursor-pointer rounded" @click="toggleCountryList">
          <div class="flex w-full rounded-xl shadow-sm">
            <div class="relative flex grow items-stretch focus-within:z-10">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i
                  v-if="fStore.state.selectedCountry"
                  class="flat rounded fi !h-[21px] !w-[28px]"
                  :class="`fi-${fStore.state.selectedCountry.iso}`"
                />
                <FlagIcon v-else class="ml-1 size-6 text-gray-800" />
              </div>
              <input
                v-model.trim="countryAutocomplete"
                type="text"
                :class="countryAutocomplete.length ? 'rounded-l-lg' : 'rounded-lg'"
                class="block w-full border-0 py-4 pl-12 font-medium text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:py-3 sm:text-sm sm:leading-6"
                :placeholder="$t('Search_country')"
              />
            </div>
            <button
              v-if="countryAutocomplete.length"
              type="button"
              class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-blue-25"
              @click="clearCountryAutocompleteInput"
            >
              <XMarkIcon class="size-5" />
            </button>
          </div>
          <ul
            v-if="isCountryListOpened"
            class="scrollbar absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            role="listbox"
          >
            <li
              v-for="country in filteredCountrySuggestions"
              :key="country.id"
              :class="{ 'opacity-25': !country.hasProvider }"
              class="relative flex cursor-default select-none items-center p-2 text-gray-900 hover:cursor-pointer hover:bg-gray-100"
              role="option"
              tabindex="-1"
              @click="selectCountry(country)"
            >
              <i :class="`fi-${country.iso}`" class="flat fi !h-[21px] !w-[28px] rounded" />
              <span class="ml-2 block truncate text-sm">{{ country.name }}</span>
            </li>
            <li
              v-if="!filteredCountrySuggestions.length"
              class="relative flex cursor-default select-none items-center p-2 text-gray-900"
            >
              {{ $t(`nothing_found`) }}
            </li>
          </ul>
        </div>
      </div>
      <div ref="providerList" class="relative mt-4">
        <div class="cursor-pointer rounded" @click="toggleProviderList">
          <div class="flex w-full rounded-xl shadow-sm">
            <div class="relative flex grow items-stretch focus-within:z-10">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <div
                  v-if="fStore.state.selectedProviderName"
                  :style="{
                    'background-color': getProviderColor(fStore.state.selectedProviderName)
                  }"
                  class="flex h-5 w-fit shrink-0 items-center justify-center rounded px-1"
                >
                  <img
                    loading="lazy"
                    class="w-5"
                    :src="'/providers/' + fStore.state.selectedProviderName.toLowerCase() + '.png'"
                    alt=""
                  />
                </div>
                <TruckIcon v-else class="ml-1 size-6 text-gray-800" />
              </div>
              <input
                v-model.trim="providerAutocomplete"
                type="text"
                :class="providerAutocomplete.length ? 'rounded-l-lg' : 'rounded-lg'"
                class="block w-full border-0 py-4 pl-12 font-medium text-gray-800 ring-1 ring-inset ring-gray-300 placeholder:text-sm placeholder:font-normal placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:py-3 sm:text-sm sm:leading-6"
                :placeholder="$t('Search_provider')"
              />
            </div>
            <button
              v-if="providerAutocomplete.length"
              type="button"
              class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-blue-25"
              @click="clearProviderAutocompleteInput"
            >
              <XMarkIcon class="size-5" />
            </button>
          </div>
          <ul
            v-if="isProviderListOpened"
            class="scrollbar absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            role="listbox"
          >
            <li
              v-for="provider in filteredProviderSuggestions"
              :key="provider.name"
              class="relative flex cursor-default select-none items-center p-2 text-gray-900 hover:cursor-pointer hover:bg-gray-100"
              role="option"
              tabindex="-1"
              @click="selectProvider(provider)"
            >
              <div
                :style="{ 'background-color': provider.color }"
                class="flex h-5 w-fit shrink-0 items-center justify-center rounded border border-zinc-300 p-1 hover:opacity-75"
              >
                <img
                  loading="lazy"
                  class="w-5"
                  :src="'/providers/' + provider.name.toLowerCase() + '.png'"
                  alt=""
                />
              </div>
              <span class="ml-2 block truncate text-sm">{{ provider.name }}</span>
            </li>
            <li
              v-if="!filteredProviderSuggestions.length"
              class="relative flex cursor-default select-none items-center p-2 text-gray-900"
            >
              {{ $t(`nothing_found`) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mb-4 mt-2 w-full px-2 lg:px-3">
      <p class="text-slate-500">{{ $t('Results_found') }}: {{ filteredCities.length }}</p>
    </div>
    <SelectedCity :providers="props.providers" />
    <div class="">
      <DynamicScroller
        v-if="filteredCities.length"
        :items="filteredCities"
        :min-item-size="100"
        key-field="id"
        page-mode
      >
        <template #default="{ item, active }">
          <DynamicScrollerItem
            :size-dependencies="[item.name]"
            :item="item"
            :active="active"
            :class="fStore.state.selectedCity ? 'opacity-25 saturate-50' : ''"
            class="group flex origin-left cursor-pointer flex-col justify-between gap-x-6 border-b transition-all duration-500 ease-out hover:brightness-105 hover:drop-shadow-xl sm:flex-row md:items-center"
            @click="showCity(item)"
          >
            <div
              class="flex w-full justify-between px-2 py-6 pb-1 sm:flex-col sm:justify-start sm:pb-4 lg:px-3"
            >
              <div class="flex w-max items-center">
                <i
                  :class="`fi-${item.country.iso}`"
                  class="flat fi w-12 h-9 shrink-0 rounded shadow"
                />
                <div class="ml-3 flex flex-col justify-start">
                  <p
                    class="mr-2 origin-left break-all rounded-full font-bold transition-all duration-500 ease-out group-hover:text-gray-500"
                  >
                    {{ item.name }}
                  </p>
                  <p class="break-all text-xs font-semibold text-blue-500">
                    {{ item.country.name }}
                  </p>
                </div>
              </div>
              <div
                class="mt-0 flex w-fit items-center justify-end sm:ml-[64px] sm:mt-1 sm:justify-start"
              >
                <div class="hover:drop-shadow">
                  <FavoriteButton
                    v-if="isAuth"
                    class="flex rounded-full py-0.5 hover:drop-shadow"
                    :cityid="item.id"
                  />
                  <InfoPopup v-else class="flex rounded-full py-0.5 hover:drop-shadow" />
                </div>
                <router-link
                  class="flex items-center rounded-full z-50 relative py-0.5 text-blue-500 hover:drop-shadow"
                  :to="`/city/${item.country.slug}/${item.slug}`"
                >
                  <InformationCircleIcon class="size-8 hover:drop-shadow sm:size-6" />
                  <p class="ml-1 hidden text-xs font-medium sm:flex">
                    {{ $t('Check_details') }}
                  </p>
                </router-link>
              </div>
            </div>
            <ProviderIcons :item="item" :providers="props.providers" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
      <p v-else class="mt-8 flex justify-center font-medium text-gray-800">
        {{ $t(`no_providers`) }}
      </p>
    </div>
  </div>
</template>
