<script setup lang="ts">
import Country from '@/components/Country.vue'
import { ref, watch, type Ref } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'
import { debounce } from 'lodash'
import PrimarySaveButton from '@/components/PrimarySaveButton.vue'
import { toast } from 'vue3-toastify'
import { apiUrl, i18n } from '@/main'
import axios from 'axios'
import { MapIcon, FolderIcon } from '@heroicons/vue/24/outline'
import L from 'leaflet'
import OverlayButton from '@/components/OverlayButton.vue'
import router from '@/router'
import store from '@/store/SessionData'
if (!store.state.auth.isAdmin) {
  router.push('/')
}
const $t = i18n.global.t
interface Country {
  id: number
  name: string
  alternativeName: string
  latitude: string
  longitude: string
  iso: string
  length: number
}

function storeCountry() {
  axios
    .post('/admin/countries/', storeCountryForm)
    .then(() => {
      storeCountryForm.name = ''
      storeCountryForm.alternativeName = ''
      storeCountryForm.latitude = ''
      storeCountryForm.longitude = ''
      storeCountryForm.iso = ''
      toggleStoreDialog()
      commaInputError.value = ''
      toast.success($t('create_country_success'))
      return
    })
    .catch(() => {
      toast.error($t('create_country_error'))
    })
}

const url = window.location.pathname
const storeCountryForm = {
  name: '',
  alternativeName: '',
  latitude: '',
  longitude: '',
  iso: ''
}

const commaInputError = ref('')

function preventCommaInput(event: KeyboardEvent) {
  if (event.key === ',') {
    event.preventDefault()
    commaInputError.value = $t('Use `.` instead of `,`')
  }
}

const countries: Ref<Country[]> = ref([])
axios
  .get(`${apiUrl}/api/admin/countries`)
  .then((response) => {
    countries.value = response.data.countries
    dataIsFetched.value = true
  })
  .catch((error) => {
    console.error(error)
  })

const isStoreDialogOpened = ref(false)
const storeDialog = ref(null)
const map: any = ref(null)
const mapContainer = ref(null)
const marker: any = ref(null)
const isMapDialogOpen = ref(false)
const dataIsFetched = ref(false)

onClickOutside(storeDialog, () => (isStoreDialogOpened.value = false))

function toggleStoreDialog() {
  isStoreDialogOpened.value = !isStoreDialogOpened.value
}

const searchInput = ref('')

watch(
  searchInput,
  debounce(() => {
    axios
      .get(`/admin/countries?search=${searchInput.value}`)
      .then((response) => {
        countries.value = response.data.countries
      })
      .catch((error) => {
        console.error(error)
      })
  }, 300)
)

function clearInput() {
  searchInput.value = ''
}

const sortingOptions = [
  { name: 'Latest', href: '/admin/countries?order=latest' },
  { name: 'Oldest', href: '/admin/countries?order=oldest' },
  { name: 'By name', href: '/admin/countries?order=name' }
]

const isSortDialogOpened = ref(false)
const sortDialog = ref(null)
onClickOutside(sortDialog, () => (isSortDialogOpened.value = false))

function toggleSortDialog() {
  isSortDialogOpened.value = !isSortDialogOpened.value
}
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
  storeCountryForm.latitude = latlng.lat.toString()
  storeCountryForm.longitude = latlng.lng.toString()
}
function showMap() {
  if (!map.value) {
    buildMap()
  }
  map.value.setView(
    [
      parseFloat(storeCountryForm.latitude ? storeCountryForm.latitude : '0'),
      parseFloat(storeCountryForm.longitude ? storeCountryForm.longitude : '0')
    ],
    12
  )
  map.value.invalidateSize()
  setTimeout(() => {
    map.value.invalidateSize()
  }, 1)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map.value)
  if (!marker.value) {
    marker.value = L.marker(
      [
        parseFloat(storeCountryForm.latitude ? storeCountryForm.latitude : '0'),
        parseFloat(storeCountryForm.longitude ? storeCountryForm.longitude : '0')
      ],
      {
        draggable: true,
        autoPan: true,
        autoPanPadding: [70, 70]
      }
    ).addTo(map.value)
  } else {
    marker.value.setLatLng([
      storeCountryForm.latitude ? storeCountryForm.latitude : 0,
      storeCountryForm.longitude ? storeCountryForm.longitude : 0
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
      <div class="mt-16 size-full md:mt-0">
        <div class="m-4 flex flex-col lg:mx-8">
          <div v-if="isStoreDialogOpened" class="fixed inset-0 z-50 flex items-center bg-black/50">
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
                  {{ $t('Create country') }}
                </h1>

                <form
                  class="flex flex-col text-xs font-bold text-gray-600"
                  @submit.prevent="storeCountry"
                >
                  <label class="mb-1 mt-4">{{ $t('Name') }}</label>
                  <input
                    v-model="storeCountryForm.name"
                    class="rounded-md border border-blue-100 p-4 text-sm font-semibold text-gray-800 md:p-3"
                    type="text"
                    required
                  />
                  <label class="mb-1 mt-4">{{ $t('Alternative name') }}</label>
                  <input
                    v-model="storeCountryForm.alternativeName"
                    class="rounded-md border border-blue-100 p-4 text-sm font-semibold text-gray-800 md:p-3"
                    type="text"
                  />
                  <div class="flex grow w-full flex-col md:flex-row">
                    <div class="flex flex-col w-full md:w-1/2">
                      <label class="mb-1 mt-4">{{ $t('latitude') }}</label>
                      <input
                        v-model="storeCountryForm.latitude"
                        class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                        type="text"
                        required
                        @keydown="preventCommaInput"
                      />
                    </div>
                    <div class="flex flex-col w-full md:w-1/2">
                      <label class="mb-1 mt-4">{{ $t('longitude') }}</label>
                      <input
                        v-model="storeCountryForm.longitude"
                        class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                        type="text"
                        required
                        @keydown="preventCommaInput"
                      />
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
                  <label class="mb-1 mt-4">{{ $t('Iso') }}</label>
                  <input
                    v-model="storeCountryForm.iso"
                    class="rounded-md border border-blue-100 p-4 text-sm font-semibold text-gray-800 md:p-3"
                    type="text"
                    required
                  />
                  <small class="text-rose-600">{{ commaInputError }}</small>

                  <div class="flex w-full justify-end">
                    <PrimarySaveButton>
                      {{ $t('Save') }}
                    </PrimarySaveButton>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="mb-3 mt-4 flex flex-wrap items-center justify-end md:justify-between">
            <button
              class="mr-1 rounded bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-400 md:py-2"
              @click="toggleStoreDialog"
            >
              {{ $t('Create country') }}
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
                  :placeholder="$t('Search country')"
                />
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
            :class="countries.length ? 'justify-between' : 'justify-end'"
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
                  <router-vue
                    v-for="option in sortingOptions"
                    :key="option.href"
                    :to="option.href"
                    class="block px-4 py-2 text-sm text-gray-500 hover:text-blue-400"
                    role="menuitem"
                    tabindex="-1"
                  >
                    <span
                      :class="{
                        'font-medium text-blue-400':
                          url.startsWith(option.href) ||
                          ((url === '/admin/countries' ||
                            url.startsWith('/admin/countries?search=') ||
                            url.startsWith('/admin/countries?page=')) &&
                            option.href.startsWith('/admin/countries?order=latest'))
                      }"
                    >
                      {{ $t(option.name) }}
                    </span>
                  </router-vue>
                </div>
              </div>
            </div>
          </div>

          <div v-if="countries.length" class="rounded-lg ring-gray-300 sm:ring-1">
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell"
                  >
                    {{ $t('Name') }}
                  </th>
                  <th
                    scope="col"
                    class="table-cell py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {{ $t('Alternative name') }}
                  </th>
                  <th
                    scope="col"
                    class="hidden py-3.5 text-left text-sm font-semibold text-gray-900 xl:table-cell"
                  >
                    {{ $t('Latitude') }}
                  </th>
                  <th
                    scope="col"
                    class="hidden py-3.5 text-left text-sm font-semibold text-gray-900 xl:table-cell"
                  >
                    {{ $t('Longitude') }}
                  </th>
                  <th
                    scope="col"
                    class="hidden py-3.5 text-left text-sm font-semibold text-gray-900 xl:table-cell"
                  >
                    ISO
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="country in countries" :key="country.id" class="border-t">
                  <Country :country="country" />
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p class="mt-6 text-lg font-medium text-gray-500">
              {{ $t(`Sorry we couldn't find any countries.`) }}
            </p>
          </div>
          <!-- <Pagination :meta="props.countries.meta" :links="props.countries.links" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
