<script setup lang="ts">
import City from '@/components/City.vue'
import { computed, ref, watch, reactive, onMounted } from 'vue'
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'
import { debounce } from 'lodash'
import PrimarySaveButton from '@/components/PrimarySaveButton.vue'
import { toast } from 'vue3-toastify'
import { i18n } from '@/main'
import axios from 'axios'
import { apiUrl } from '@/main'
import store from '@/store/SessionData'
import { MapIcon, FolderIcon } from '@heroicons/vue/24/outline'
import L from 'leaflet'
import OverlayButton from '@/components/OverlayButton.vue'
import router from '@/router'
if (!store.state.auth.isAdmin) {
  router.push('/')
}
const $t = i18n.global.t
const url: string = window.location.pathname
import type { Ref } from 'vue'

const cities: Ref<any[]> = ref([])
const providers = ref<any[]>([])
const countries = ref<any[]>([])
const citiesWithoutAssignedCountry = ref<any[]>([])
const dataIsFetched = ref<boolean>(false)

axios
  .get(`${apiUrl}/api/admin/cities`)
  .then((response) => {
    cities.value = response.data.cities
    providers.value = response.data.providers
    countries.value = response.data.countries
    citiesWithoutAssignedCountry.value = response.data.citiesWithoutAssignedCountry
    let citiesNoCoords = cities.value.filter(
      (city: CityType) => !city.latitude || !city.longitude,
    ).length
    let citiesNoCountry = citiesWithoutAssignedCountry.value.length
    store.commit('setCities', { citiesNoCoords, citiesNoCountry })
    dataIsFetched.value = true
    return response
  })
  .catch((error) => {
    console.error(error)
    throw error
  })
interface CityType {
  id: string
  city_name: string
  country_name: string
  latitude: string
  longitude: string
}
const countCitiesWithoutAssignedCountry = ref(store.state.auth.cities.noCountry)
const countCitiesWithoutCoordinates = ref(store.state.auth.cities.noCoords)
const map: any = ref(null)
const mapContainer = ref(null)
const marker: any = ref(null)
const isMapDialogOpen = ref(false)
const commaInputError = ref('')

function storeCity() {
  commaInputError.value = ''
  axios
    .post(`${apiUrl}/api/admin/cities`, storeCityForm)
    .then(() => {
      storeCityForm.name = ''
      storeCityForm.latitude = ''
      storeCityForm.longitude = ''
      storeCityForm.country_id = ''
      toggleStoreDialog()
      toast.success($t('create_city_success'))
      return
    })
    .catch((error) => {
      toast.error($t('create_city_error'))
    })
}

const storeCityForm = reactive({
  name: '',
  latitude: '',
  longitude: '',
  country_id: '',
})

const isStoreDialogOpened = ref(false)
const storeDialog = ref(null)
onClickOutside(storeDialog, () => (isStoreDialogOpened.value = false))

function toggleStoreDialog() {
  isStoreDialogOpened.value = !isStoreDialogOpened.value
}

function preventCommaInput(event: KeyboardEvent) {
  if (event.key === ',') {
    event.preventDefault()
    commaInputError.value = $t('should_not_contain_comma')
  }
}

const searchInput = ref('')
onMounted(() => {
  watch(
    searchInput,
    debounce(() => {
      axios
        .get(`/admin/cities?search=${searchInput.value}`, {})
        .then(() => {
          return
        })
        .catch((error) => {
          console.error(error)
        })
    }, 300),
    { deep: true },
  )
})
function clearInput() {
  searchInput.value = ''
}

const sortingOptions = [
  { name: 'latest', to: '/admin/cities?order=latest' },
  { name: 'oldest', to: '/admin/cities?order=oldest' },
  { name: 'by_name', to: '/admin/cities?order=name' },
  { name: 'by_providers', to: '/admin/cities?order=providers' },
  { name: 'by_country', to: '/admin/cities?order=country' },
]

const isSortDialogOpened = ref(false)
const sortDialog = ref(null)
onClickOutside(sortDialog, () => (isSortDialogOpened.value = false))

function toggleSortDialog() {
  isSortDialogOpened.value = !isSortDialogOpened.value
}

const isCityWithoutCountriesListDialogOpened = ref(false)
const cityWithoutCountriesListDialog = ref(null)
onClickOutside(
  cityWithoutCountriesListDialog,
  () => (isCityWithoutCountriesListDialogOpened.value = false),
)

function toggleCityWithoutCountriesListDialog() {
  isCityWithoutCountriesListDialogOpened.value = !isCityWithoutCountriesListDialogOpened.value
}

function deleteCityWithoutAssignedCountry(city: CityType) {
  axios
    .delete(`${apiUrl}/api/delete-city-without-assigned-country/${city.id}`)
    .then(() => {
      toast.success($t('delete_city_success'))
      return
    })
    .catch(() => {
      toast.error($t('delete_city_error'))
    })
}

function deleteAllCitiesWithoutCountry() {
  axios
    .post(`${apiUrl}/api/delete-all-cities-without-assigned-country`)
    .then(() => {
      toast.success($t('delete_cities_success'))
    })
    .catch(() => {
      toast.error($t('delete_cities_error'))
    })
}

function searchCity(city: CityType) {
  searchInput.value = city.city_name
  toggleCityWithoutCountriesListDialog()
}

function sendCityToCreateForm(city: CityType) {
  storeCityForm.name = city.city_name
  toggleCityWithoutCountriesListDialog()
  toggleStoreDialog()
}

function goToGoogleMaps(city: CityType) {
  window.open('https://www.google.com/maps/search/' + city.city_name)
}

const searchCityWithoutCountryInput = ref('')

function clearCityWithoutCountryInput() {
  searchCityWithoutCountryInput.value = ''
}

const filteredCitiesWithoutCountry = computed(() => {
  return citiesWithoutAssignedCountry.value.filter((city) => {
    return city.city_name.toLowerCase().includes(searchCityWithoutCountryInput.value.toLowerCase())
  })
})
function buildMap() {
  if (!map.value) {
    if (mapContainer.value) {
      map.value = L.map(mapContainer.value)
    }
  }
}
function readMapMarker() {
  if (!marker.value) {
    return
  }
  const latlng = (marker.value as L.Marker).getLatLng()
  storeCityForm.latitude = latlng.lat.toString()
  storeCityForm.longitude = latlng.lng.toString()
}
function showMap() {
  if (!map.value) {
    buildMap()
  }
  map.value.setView(
    [
      parseFloat(storeCityForm.latitude ? storeCityForm.latitude : '0'),
      parseFloat(storeCityForm.longitude ? storeCityForm.longitude : '0'),
    ],
    12,
  )
  map.value.invalidateSize()
  setTimeout(() => {
    map.value.invalidateSize()
  }, 1)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map.value)
  if (!marker.value) {
    marker.value = L.marker(
      [
        parseFloat(storeCityForm.latitude ? storeCityForm.latitude : '0'),
        parseFloat(storeCityForm.longitude ? storeCityForm.longitude : '0'),
      ],
      {
        draggable: true,
        autoPan: true,
        autoPanPadding: [70, 70],
      },
    ).addTo(map.value)
  } else {
    marker.value.setLatLng([
      storeCityForm.latitude ? storeCityForm.latitude : 0,
      storeCityForm.longitude ? storeCityForm.longitude : 0,
    ])
  }
  isMapDialogOpen.value = true
}

function hideMap(save: boolean) {
  if (save) {
    readMapMarker()
  }
  isMapDialogOpen.value = false
}
</script>

<template>
  <div v-if="dataIsFetched" class="flex h-full min-h-screen flex-col md:flex-row">
    <div class="flex w-full md:justify-end">
      <div class="flex size-full flex-col justify-between md:mt-0">
        <div class="m-4 flex flex-col lg:mx-8">
          <div
            v-show="isStoreDialogOpened"
            class="fixed inset-0 z-50 flex items-center bg-black/50"
          >
            <div
              ref="storeDialog"
              class="mx-auto w-11/12 rounded-lg bg-white shadow-lg sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
            >
              <div class="flex w-full justify-end">
                <button class="px-4 pt-4" @click="toggleStoreDialog">
                  <XMarkIcon class="size-6" />
                </button>
              </div>

              <div class="flex flex-col p-6 pt-0">
                <h1 class="mb-3 text-lg font-bold text-gray-800">
                  {{ $t('create_city') }}
                </h1>

                <form
                  class="flex flex-col text-xs font-bold text-gray-600"
                  @submit.prevent="storeCity"
                >
                  <label class="mb-1 mt-4">{{ $t('name') }}</label>
                  <input
                    v-model="storeCityForm.name"
                    class="rounded-md border border-blue-100 p-4 text-sm font-semibold text-gray-800 md:p-3"
                    type="text"
                    required
                  >
                  <div class="flex grow w-full flex-col md:flex-row">
                    <div class="flex flex-col w-full md:w-1/2">
                      <label class="mb-1 mt-4">{{ $t('latitude') }}</label>
                      <input
                        v-model="storeCityForm.latitude"
                        class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                        type="text"
                        required
                        @keydown="preventCommaInput"
                      >
                    </div>
                    <div class="flex flex-col w-full md:w-1/2">
                      <label class="mb-1 mt-4">{{ $t('longitude') }}</label>
                      <input
                        v-model="storeCityForm.longitude"
                        class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                        type="text"
                        required
                        @keydown="preventCommaInput"
                      >
                    </div>
                  </div>
                  <div class="flex w-full justify-end">
                    <button
                      type="button"
                      class="mt-3 flex w-full shrink-0 justify-center rounded border border-blue-500 bg-white px-5 py-3 text-blue-500 hover:bg-blue-50 md:w-fit md:py-2"
                      @click="showMap()"
                    >
                      <span class="flex flex-wrap items-center justify-end space-x-2">
                        <span class="font-bold">
                          {{ $t('mark_on_map') }}
                        </span>
                        <MapIcon class="size-5" />
                      </span>
                    </button>
                  </div>

                  <div
                    v-show="isMapDialogOpen"
                    class="fixed inset-0 z-20 flex items-center"
                    :class="isMapDialogOpen ? 'h-full' : 'h:1/2'"
                  >
                    <div
                      ref="mapDialog"
                      class="mx-auto w-11/12 h-1/2 relative rounded-lg bg-white sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col overflow-hidden"
                    >
                      <div id="mapContainer" ref="mapContainer" class="absolute z-10 size-full" />

                      <div class="absolute top-0 right-0 z-20 flex-col">
                        <OverlayButton :hint="$t('cancel')" @click="hideMap(false)">
                          <XMarkIcon class="size-5 translate-x-1/2 translate-y-1/2 absolute" />
                        </OverlayButton>
                        <OverlayButton :hint="$t('save_coords')" @click="hideMap(true)">
                          <FolderIcon class="size-5 translate-x-1/2 translate-y-1/2 absolute" />
                        </OverlayButton>
                      </div>
                    </div>
                  </div>

                  <p v-if="commaInputError" class="text-xs text-rose-600">
                    {{ commaInputError }}
                  </p>
                  <label class="mb-1 mt-4">{{ $t('country') }}</label>
                  <select
                    v-model="storeCityForm.country_id"
                    required
                    class="rounded-md border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                  >
                    <option
                      v-for="country in countries"
                      :key="country.id"
                      class="m-6 p-6"
                      :value="country.id"
                    >
                      {{ country.name }}
                    </option>
                  </select>

                  <div class="flex w-full justify-end">
                    <PrimarySaveButton>
                      {{ $t('save') }}
                    </PrimarySaveButton>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="mb-3 mt-4 flex w-full flex-wrap items-center justify-end md:justify-between">
            <button
              class="mr-1 rounded bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-400 md:py-2"
              @click="toggleStoreDialog"
            >
              {{ $t('create_city') }}
            </button>

            <div class="m-1 flex w-full rounded-md shadow-sm md:w-fit">
              <div class="relative flex grow items-stretch focus-within:z-10">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon class="size-5 text-gray-800" />
                </div>
                <input
                  v-model.trim="searchInput"
                  type="text"
                  class="block w-full rounded border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:text-sm sm:leading-6 md:py-1.5"
                  :placeholder="$t('search_city')"
                >
              </div>
              <button
                v-if="searchInput.length"
                type="button"
                class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-blue-25"
                @click="clearInput"
              >
                <XMarkIcon class="size-5" />
              </button>
            </div>
          </div>

          <div
            v-if="countCitiesWithoutAssignedCountry"
            class="scrollbar mt-3 flex w-full justify-start overflow-auto"
          >
            <button
              class="flex items-center rounded border border-rose-500 bg-white p-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
              @click="toggleCityWithoutCountriesListDialog"
            >
              <PencilSquareIcon class="mr-1 size-5" />
              {{ $t('cities_no_country') }}: {{ countCitiesWithoutAssignedCountry }}
            </button>
          </div>

          <div
            v-if="countCitiesWithoutCoordinates"
            class="scrollbar my-2 flex w-full justify-start overflow-auto"
          >
            <router-link
              :to="'/admin/cities?order=empty-coordinates'"
              class="flex items-center rounded border border-rose-500 bg-white p-2 text-sm font-medium text-rose-500 hover:bg-rose-50"
            >
              <PencilSquareIcon class="mr-1 size-5" />
              {{ $t('cities_no_coords') }}: {{ countCitiesWithoutCoordinates }}
            </router-link>
          </div>

          <div v-if="isCityWithoutCountriesListDialogOpened" class="flex flex-col">
            <div class="fixed inset-0 z-10 flex items-center bg-black/50 py-8">
              <div
                ref="cityWithoutCountriesListDialog"
                class="scrollbar mx-auto h-fit max-h-full w-11/12 overflow-y-auto rounded-lg bg-white pb-6 sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3"
              >
                <div class="flex w-full justify-end">
                  <button class="px-4 pt-4" @click="toggleCityWithoutCountriesListDialog">
                    <XMarkIcon class="size-6" />
                  </button>
                </div>
                <div class="flex flex-col">
                  <div class="size-full flex-col px-6">
                    <h1 class="text-xl font-bold text-gray-800">{{ $t('cities_no_country') }}:</h1>
                    <div class="mb-2 mt-6 flex w-full rounded-md shadow-sm">
                      <div class="relative flex grow items-stretch focus-within:z-10">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <MagnifyingGlassIcon class="size-5 text-gray-800" />
                        </div>
                        <input
                          v-model.trim="searchCityWithoutCountryInput"
                          type="text"
                          class="block w-full rounded border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-300 sm:text-sm sm:leading-6 md:py-1.5"
                          :placeholder="$t('search_city')"
                        >
                      </div>
                      <button
                        v-if="searchCityWithoutCountryInput.length"
                        type="button"
                        class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-blue-25"
                        @click="clearCityWithoutCountryInput"
                      >
                        <XMarkIcon class="size-5" />
                      </button>
                    </div>

                    <div v-if="filteredCitiesWithoutCountry.length" class="flex justify-end">
                      <button
                        class="my-2 flex items-center rounded border border-rose-500 p-2 text-xs font-medium text-rose-500 hover:bg-rose-100"
                        @click="deleteAllCitiesWithoutCountry"
                      >
                        <TrashIcon class="mr-1 size-4 shrink-0" />
                        {{ $t('delete_cities_no_country') }}
                      </button>
                    </div>

                    <div v-if="filteredCitiesWithoutCountry.length">
                      <div
                        v-for="city in filteredCitiesWithoutCountry"
                        :key="city.id"
                        class="mb-4 flex flex-col justify-center rounded border p-2 font-light"
                      >
                        <p
                          class="cursor-pointer font-bold text-gray-800 hover:text-gray-500"
                          @click="goToGoogleMaps(city)"
                        >
                          {{ city.city_name }}
                        </p>
                        <p class="text-sm font-medium text-blue-500">
                          {{ city.country_name }}
                        </p>
                        <div class="flex justify-end">
                          <button class="rounded-full p-1 hover:bg-gray-100">
                            <TrashIcon
                              class="size-7 sm:size-5"
                              @click="deleteCityWithoutAssignedCountry(city)"
                            />
                          </button>

                          <button class="ml-2 rounded-full p-1 hover:bg-gray-100">
                            <MagnifyingGlassIcon
                              class="size-7 sm:size-5"
                              @click="searchCity(city)"
                            />
                          </button>
                          <button class="ml-2 rounded-full p-1 hover:bg-gray-100">
                            <PlusCircleIcon
                              class="size-7 sm:size-5"
                              @click="sendCityToCreateForm(city)"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p v-else class="mt-6 flex text-sm font-medium text-gray-500">
                      {{ $t(`did_not_find_anything`) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            :class="cities.length ? 'justify-between' : 'justify-end'"
            class="flex w-full flex-wrap items-center"
          >
            <div class="relative inline-block text-left">
              <div>
                <button
                  ref="sortDialog"
                  class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  aria-expanded="false"
                  aria-haspopup="true"
                  @click="toggleSortDialog"
                >
                  {{ $t('sort') }}
                  <ChevronDownIcon class="ml-1 size-5" />
                </button>
              </div>

              <div
                v-if="isSortDialogOpened"
                class="absolute right-1 z-10 mt-3.5 w-max rounded-md bg-white shadow-lg shadow-gray-300 ring-1 ring-gray-300 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
              >
                <div class="py-1" role="none">
                  <router-link
                    v-for="option in sortingOptions"
                    :key="option.to"
                    :to="option.to"
                    class="block px-4 py-2 text-sm text-gray-500 hover:text-blue-400"
                    role="menuitem"
                    tabindex="-1"
                  >
                    <span
                      :class="{
                        'font-medium text-blue-400':
                          url.startsWith(option.to) ||
                          ((url === '/admin/cities' ||
                            url.startsWith('/admin/cities?search=') ||
                            url.startsWith('/admin/cities?page=')) &&
                            option.to.startsWith('/admin/cities?order=latest'))
                      }"
                    >
                      {{ $t(option.name) }}
                    </span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-if="cities.length" class="rounded-lg ring-gray-300 sm:ring-1">
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell"
                  >
                    {{ $t('name') }}
                  </th>
                  <th
                    scope="col"
                    class="hidden py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {{ $t('longitude') }}
                  </th>
                  <th
                    scope="col"
                    class="hidden py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {{ $t('latitude') }}
                  </th>
                  <th
                    scope="col"
                    class="py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    {{ $t('providers') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="city in cities" :key="city.id" class="border-t">
                  <City :providers="providers" :city="city" />
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else>
            <p class="mt-6 text-lg font-medium text-gray-500">
              {{ $t(`no_cities_found`) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
