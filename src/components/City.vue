<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MapIcon,
  ChevronDownIcon,
  FolderIcon
} from '@heroicons/vue/24/outline'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { onClickOutside } from '@vueuse/core'
import SecondarySaveButton from '@/components/SecondarySaveButton.vue'
import toast from 'vue3-toastify'
import { i18n } from '@/main'
import DeleteModal from '@/components/DeleteModal.vue'
import L from 'leaflet'

const $t = i18n.global.t
const showDeleteModal = ref(false)
interface City {
  id: number
  name: string
  slug: string
  cityOpinions: any[]
  cityProviders: any[]
  city_alternative_names: any[]
  country: {
    id: number
    name: string
    slug: string
  }
  latitude: string
  longitude: string
}

const props = defineProps({
  city: {
    type: Object as () => City,
    required: true
  },
  providers: {
    type: Array as () => any[],
    required: true
  }
})
const country = props.city.country ?? ''
const destroyCity = (cityId) => {
  router.delete(`/admin/cities/${cityId}`, {
    onSuccess: () => {
      toast.success($t('City deleted successfully.'))
      showDeleteModal.value = false
    }
  })
}

function updateCity(cityId) {
  updateCityForm.patch(`/admin/cities/${cityId}`, {
    onSuccess: () => {
      toggleEditDialog()
      toast.success($t('City updated successfully.'))
    }
  })
}

const updateCityForm = useForm({
  name: props.city.name,
  latitude: props.city.latitude,
  longitude: props.city.longitude
})

const storeAlternativeCityNameErrors = ref([])

function storeAlternativeCityName(cityId) {
  router.post(
    '/city-alternative-name',
    {
      name: storeCityAlternativeNameForm.name,
      city_id: cityId
    },
    {
      onSuccess: () => {
        storeCityAlternativeNameForm.name = ''
        storeAlternativeCityNameErrors.value = []
        toast.success($t('Alternative city name added successfully.'))
      },
      onError: (errors) => {
        storeAlternativeCityNameErrors.value = errors
        toast.error($t('There was an error adding alternative city name.'))
      }
    }
  )
}

const storeCityAlternativeNameForm = reactive({
  name: ''
})

function destroyAlternativeCityName(alternativeCityNameId) {
  router.delete(`/city-alternative-name/${alternativeCityNameId}`, { replace: true })
  toast.success($t('Alternative city name deleted successfully.'))
}

const commaInputError = ref('')

function preventCommaInput(event) {
  if (event.key === ',') {
    event.preventDefault()
    commaInputError.value = $t('Use `.` instead of `,`')
  }
}
const isEditDialogOpened = ref(false)
const editDialog = ref(null)
onClickOutside(editDialog, () => (isMapDialogOpen ? '' : (isEditDialogOpened.value = false)))

function toggleEditDialog() {
  isEditDialogOpened.value = !isEditDialogOpened.value
  commaInputError.value = ''
  isProvidersFormOpened.value = false
  isCityFormOpened.value = false
  isAlternativeCityNameFormOpened.value = false
}
const selectedCityProviders = reactive([])
const map = ref(null)
const mapContainer = ref(null)
const pinLatitute = ref(null)
const pinLongitude = ref(null)
onMounted(() => {
  props.city.cityProviders?.forEach((provider) => {
    selectedCityProviders.push(provider.provider_name)
  })
  buildMap()
})
function buildMap() {
  map.value = L.map(mapContainer.value)
}

function toggleProviderSelection(provider) {
  if (selectedCityProviders.includes(provider)) {
    const index = selectedCityProviders.indexOf(provider)
    selectedCityProviders.splice(index, 1)
  } else {
    selectedCityProviders.push(provider)
  }
}

function updateCityProviders(cityId) {
  router.patch(
    `/update-city-providers/${cityId}`,
    {
      providerNames: selectedCityProviders
    },
    {
      onSuccess: () => {
        toggleEditDialog()
        toast.success($t('City providers updated successfully.'))
      }
    }
  )
}

const filteredSelectedCityProviders = computed(() => {
  return props.providers.filter((provider) => selectedCityProviders.includes(provider.name))
})

const isCityFormOpened = ref(false)

function toggleCityForm() {
  isCityFormOpened.value = !isCityFormOpened.value

  isAlternativeCityNameFormOpened.value = false
  isProvidersFormOpened.value = false
}

const isAlternativeCityNameFormOpened = ref(false)

function toggleAlternativeCityNameForm() {
  isAlternativeCityNameFormOpened.value = !isAlternativeCityNameFormOpened.value
  isCityFormOpened.value = false
  isProvidersFormOpened.value = false
}

const isProvidersFormOpened = ref(false)

function toggleProvidersForm() {
  isProvidersFormOpened.value = !isProvidersFormOpened.value

  isCityFormOpened.value = false
  isAlternativeCityNameFormOpened.value = false
}
const isMapDialogOpen = ref(false)
function readMapMarker() {
  //read the coordinates from the marker and update the form
  const latlng = marker.value.getLatLng()
  updateCityForm.latitude = latlng.lat
  updateCityForm.longitude = latlng.lng
}
const marker = ref(null)
function showMap() {
  //use leaflet with draggable marker
  map.value.setView(
    [
      updateCityForm.latitude ? updateCityForm.latitude : 0,
      updateCityForm.longitude ? updateCityForm.longitude : 0
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
        updateCityForm.latitude ? updateCityForm.latitude : 0,
        updateCityForm.longitude ? updateCityForm.longitude : 0
      ],
      {
        draggable: 1,
        autoPan: 1,
        autoPanPadding: [70, 70]
      }
    ).addTo(map.value)
  }
  isMapDialogOpen.value = true
}
function hideMap(save: Boolean) {
  //read the coordinates from the marker and update the form
  if (save) {
    readMapMarker()
  }
  isMapDialogOpen.value = false
}
//import leaflet map and put it in the #map element
import 'leaflet/dist/leaflet.css'
import { isMap } from 'util/types'

// ...

// ...
</script>

<template>
  <td class="relative py-4 pl-4 text-sm sm:pl-6 sm:pr-3">
    <div class="flex items-center font-medium text-gray-800">
      <i :class="country.iso" class="flat flag large mr-2 shrink-0" :title="country.name" />
      <p
        class="cursor-pointer break-all rounded hover:bg-blumilk-25"
        @click="goToGoogleMaps(city.latitude, city.longitude)"
      >
        {{ city.name }}
      </p>
    </div>
    <div v-if="city.latitude" class="mt-1 flex flex-col break-all text-gray-500 sm:block lg:hidden">
      <span>{{ city.latitude }}</span>
      <span class="hidden sm:inline">, </span>
      <br class="hidden sm:inline" />
      <span>{{ city.longitude }}</span>
    </div>
  </td>
  <td class="hidden break-all py-3.5 text-sm text-gray-500 lg:table-cell">
    {{ city.latitude }}
  </td>
  <td class="hidden break-all py-3.5 pl-1 text-sm text-gray-500 lg:table-cell">
    {{ city.longitude }}
  </td>

  <td class="py-3.5 text-sm text-gray-500 lg:table-cell">
    <div class="flex lg:hidden">
      <div
        v-if="selectedCityProviders.length > 0"
        class="m-1 flex h-5 w-fit items-center justify-center rounded border border-zinc-300 bg-zinc-300 p-1"
      >
        <div class="flex size-5 items-center justify-center text-xs text-gray-500">
          {{ selectedCityProviders.length }}
        </div>
      </div>
      <div v-else class="m-1 flex h-5 w-fit items-center justify-center p-1">
        <div class="flex size-5 items-center justify-center text-xs text-gray-500">-</div>
      </div>
    </div>
    <div class="hidden items-center lg:flex">
      <div class="items-top flex h-1/2 flex-wrap items-center">
        <div
          v-for="provider in filteredSelectedCityProviders.slice(0, 3)"
          :key="provider.name"
          :style="{
            'background-color': selectedCityProviders.includes(provider.name) ? provider.color : ''
          }"
          :class="
            selectedCityProviders.includes(provider.name)
              ? 'border-zinc-600 drop-shadow-lg'
              : 'hidden'
          "
          class="m-1 mr-5 flex h-5 w-fit scale-[1.75] items-center justify-center rounded bg-zinc-300 p-1"
        >
          <img
            class="w-5"
            :src="'/providers/' + provider.name.toLowerCase() + '.png'"
            :title="provider.name"
            alt=""
          />
        </div>

        <div
          v-if="selectedCityProviders.length > 3"
          class="m-1 flex h-5 w-fit items-center justify-center rounded border border-zinc-300 bg-zinc-300 p-1"
        >
          <div class="flex size-5 items-center justify-center text-xs text-gray-500">
            +{{ selectedCityProviders.length - 3 }}
          </div>
        </div>
        <div
          v-else-if="selectedCityProviders.length === 0"
          class="m-1 flex h-5 w-fit items-center justify-center p-1"
        >
          <div class="flex size-5 items-center justify-center text-xs text-gray-500">-</div>
        </div>
      </div>
    </div>
  </td>

  <td
    class="relative table-cell justify-end border-t text-right text-xs font-medium sm:pl-3 md:pr-2"
  >
    <span class="flex flex-wrap">
      <button
        class="mx-0.5 mb-1 flex w-fit shrink-0 items-center rounded py-1 pr-2 text-blumilk-500 hover:bg-blumilk-25"
        @click="toggleEditDialog"
      >
        <PencilIcon class="h-5 w-8 text-blumilk-500" />
        {{ $t('Edit') }}
      </button>

      <button
        class="mx-0.5 mb-1 flex w-fit shrink-0 items-center rounded py-1 pr-2 text-rose-500 hover:bg-rose-100"
        @click="showDeleteModal = true"
      >
        <TrashIcon class="h-5 w-8 text-rose-500" />
        {{ $t('Delete') }}
      </button>

      <DeleteModal
        v-if="showDeleteModal"
        :name="city.name"
        :type="'City'"
        @close="showDeleteModal = false"
        @delete="destroyCity(city.id)"
      />
    </span>
  </td>

  <div v-if="isEditDialogOpened" class="flex flex-col overflow-y-auto">
    <div class="fixed inset-0 z-10 flex items-center overflow-y-auto bg-black/50">
      <div
        ref="editDialog"
        class="mx-auto w-11/12 rounded-lg bg-white pb-6 sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3"
      >
        <div class="flex w-full justify-end">
          <button class="px-4 pt-4" @click="toggleEditDialog">
            <XMarkIcon class="size-6" />
          </button>
        </div>

        <button
          :class="isCityFormOpened ? 'bg-blumilk-50' : ''"
          class="mb-3 ml-6 rounded-lg bg-blumilk-25 px-3 py-1 text-sm font-bold text-gray-800 hover:bg-blumilk-50"
          @click="toggleCityForm"
        >
          <div class="inline-flex">
            {{ $t('Update city') }}
            <ChevronDownIcon
              class="ml-1 h-5 w-5 transition-transform"
              :class="isCityFormOpened ? 'rotate-180' : ''"
            />
          </div>
        </button>
        <form
          v-if="isCityFormOpened"
          class="flex flex-col rounded px-6 text-xs font-bold text-gray-600"
          @submit.prevent="updateCity(city.id)"
        >
          <label class="mb-1 mt-4">{{ $t('Name') }}</label>
          <input
            v-model="updateCityForm.name"
            class="rounded border border-blumilk-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
            type="text"
            required
          />
          <ErrorMessage :message="updateCityForm.errors.name" />
          <div class="flex flex-grow w-full flex-col md:flex-row">
            <div class="flex flex-col w-full md:w-1/2">
              <label class="mb-1 mt-4">{{ $t('Latitude') }}</label>
              <input
                v-model="updateCityForm.latitude"
                class="rounded border border-blumilk-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                type="text"
                required
                @keydown="preventCommaInput"
              />
              <ErrorMessage :message="updateCityForm.errors.latitude" />
            </div>
            <div class="flex flex-col w-full md:w-1/2">
              <label class="mb-1 mt-4">{{ $t('Longitude') }}</label>
              <input
                v-model="updateCityForm.longitude"
                class="rounded border border-blumilk-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                type="text"
                required
                @keydown="preventCommaInput"
              />
              <ErrorMessage :message="updateCityForm.errors.longitude" />
            </div>
          </div>
          <div class="flex w-full justify-end">
            <button
              type="button"
              @click="showMap()"
              class="mt-3 flex w-full shrink-0 justify-center rounded border border-blumilk-500 bg-white px-5 py-3 text-blumilk-500 hover:bg-blumilk-50 md:w-fit md:py-2"
            >
              <span class="flex flex-wrap items-center justify-end space-x-2">
                <span class="font-bold">
                  {{ $t('mark_on_map') }}
                </span>
                <MapIcon class="size-5" />
              </span>
            </button>
          </div>
          <small class="text-rose-600">{{ commaInputError }}</small>

          <div class="flex w-full justify-end">
            <SecondarySaveButton>
              {{ $t('Save') }}
            </SecondarySaveButton>
          </div>
        </form>

        <br />
        <button
          :class="isAlternativeCityNameFormOpened ? 'bg-blumilk-50' : ''"
          class="mb-3 ml-6 rounded-lg bg-blumilk-25 px-3 py-1 text-sm font-bold text-gray-800 hover:bg-blumilk-50"
          @click="toggleAlternativeCityNameForm"
        >
          <div class="inline-flex">
            {{ $t('Add alternative name') }}
            <ChevronDownIcon
              class="ml-1 h-5 w-5 transition-transform"
              :class="isAlternativeCityNameFormOpened ? 'rotate-180' : ''"
            />
          </div>
        </button>
        <form
          v-if="isAlternativeCityNameFormOpened"
          class="flex flex-col rounded p-6"
          @submit.prevent="storeAlternativeCityName(city.id)"
        >
          <div class="flex flex-col text-xs">
            <label class="mb-1 mt-4 text-xs font-bold text-gray-600">{{
              $t('Alternative name')
            }}</label>
            <input
              v-model="storeCityAlternativeNameForm.name"
              class="rounded border border-blumilk-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
              type="text"
              required
            />
            <ErrorMessage :message="storeAlternativeCityNameErrors.name" />
            <div class="flex w-full justify-end">
              <SecondarySaveButton>
                {{ $t('Save') }}
              </SecondarySaveButton>
            </div>
          </div>
        </form>

        <div v-if="isAlternativeCityNameFormOpened" class="flex flex-wrap">
          <div
            v-for="alternativeName in props.city.city_alternative_names"
            :key="alternativeName.id"
            class="ml-6"
          >
            <div
              class="group flex w-fit cursor-pointer break-all rounded py-1 pl-1 pr-3 text-sm font-bold text-zinc-500 hover:bg-blumilk-25"
              @click="destroyAlternativeCityName(alternativeName.id)"
            >
              <p class="mr-1">
                {{ alternativeName.name }}
              </p>
              <span class="hidden group-hover:block">
                <XMarkIcon class="size-5" />
              </span>
            </div>
          </div>
        </div>

        <hr v-if="isAlternativeCityNameFormOpened" class="mx-6 my-2 h-px border-0 bg-gray-300" />

        <br />
        <button
          :class="isProvidersFormOpened ? 'bg-blumilk-50' : ''"
          class="ml-6 flex rounded-lg bg-blumilk-25 px-3 py-1 text-sm font-bold text-gray-800 hover:bg-blumilk-50"
          @click="toggleProvidersForm"
        >
          <div class="inline-flex">
            {{ $t('Providers') }}
            <ChevronDownIcon
              class="ml-1 h-5 w-5 transition-transform"
              :class="isProvidersFormOpened ? 'rotate-180' : ''"
            />
          </div>
        </button>

        <div
          v-if="isProvidersFormOpened"
          class="mt-4 flex flex-col rounded border-blumilk-100 px-6"
        >
          <div class="flex flex-wrap">
            <div
              v-for="provider in props.providers"
              :key="provider.name"
              :style="{
                'background-color': selectedCityProviders.includes(provider.name)
                  ? provider.color
                  : ''
              }"
              :class="
                selectedCityProviders.includes(provider.name)
                  ? 'border-zinc-600 drop-shadow-lg'
                  : ''
              "
              class="mx-1 my-2 flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-zinc-300 p-1"
              @click="toggleProviderSelection(provider.name)"
            >
              <input v-model="selectedCityProviders" class="hidden" type="checkbox" />
              <label class="cursor-pointer">
                <img
                  class="w-10"
                  :src="'/providers/' + provider.name.toLowerCase() + '.png'"
                  alt=""
                />
              </label>
            </div>
          </div>
          <div class="flex w-full justify-end text-xs">
            <SecondarySaveButton @click="updateCityProviders(city.id)">
              {{ $t('Save') }}
            </SecondarySaveButton>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-show="isMapDialogOpen"
    class="fixed inset-0 z-20 flex items-center"
    :class="isMapDialogOpen ? 'h-full' : 'h:1/2'"
  >
    <div
      ref="mapDialog"
      class="mx-auto w-11/12 relative rounded-lg bg-white sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/3 flex flex-col overflow-hidden"
      :class="isMapDialogOpen ? 'h-1/2' : 'h-0'"
    >
      <div id="mapContainer" ref="mapContainer" class="absolute z-10 size-full" />

      <div class="w-full flex h-16 flex-row absolute bottom-0 left-0 z-20">
        <button
          @click="hideMap(false)"
          type="button"
          class="flex h-16 w-1/2 place-items-center justify-center bg-gradient-to-b animated-background from-transparent to-black/20 [&>span]:hover:bottom-1 transition-all"
        >
          <span
            class="flex flex-row relative bottom-0 items-center space-x-2 text-white drop-shadow-[0_1.2px_3px_rgba(0,0,0,1)] transition-all"
          >
            <span class="font-bold">
              {{ $t('Cancel') }}
            </span>
            <XMarkIcon class="size-5" />
          </span>
        </button>
        <button
          @click="hideMap(true)"
          type="button"
          class="flex h-16 w-1/2 place-items-center justify-center bg-gradient-to-b animated-background from-transparent to-black/20 [&>span]:hover:bottom-1 transition-all"
        >
          <span
            class="flex flex-row relative bottom-0 items-center space-x-2 text-white drop-shadow-[0_1.2px_3px_rgba(0,0,0,1)] transition-all"
          >
            <span class="font-bold">
              {{ $t('Save') }}
            </span>
            <FolderIcon class="size-5" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
