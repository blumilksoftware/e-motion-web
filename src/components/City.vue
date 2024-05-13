<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  MapIcon,
  ChevronDownIcon,
  FolderIcon,
} from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'
import SecondarySaveButton from '@/components/SecondarySaveButton.vue'
import OverlayButton from '@/components/OverlayButton.vue'
import { toast } from 'vue3-toastify'
import { apiUrl, i18n } from '@/main'
import DeleteModal from '@/components/DeleteModal.vue'
import L, { Map } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

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
    alternative_name: string
    iso: string
    latitude: string
    longitude: string
  }
  latitude: string
  longitude: string
}

interface Provider {
  id: number
  name: string
  color: string
}

const props = defineProps({
  city: {
    type: Object as () => City,
    required: true,
  },
  providers: {
    type: Object as () => Provider[],
    required: true,
  },
})

const destroyCity = (cityId: number) => {
  axios
    .delete(`${apiUrl}/api/admin/cities/${cityId}`)
    .then(() => {
      toast.success($t('city_delete_success'))
    })
    .catch(() => {
      toast.error($t('city_delete_error'))
    })
  showDeleteModal.value = false
}

const updateCityForm = {
  name: props.city.name,
  latitude: props.city.latitude,
  longitude: props.city.longitude,
}

const storeCityAlternativeNameForm = reactive({
  name: '',
})

const filteredSelectedCityProviders = computed(() => {
  return props.providers.filter((provider) => selectedCityProviders.includes(provider.name))
})

const $t = i18n.global.t
const showDeleteModal = ref(false)
const country = props.city.country ?? ''
const storeAlternativeCityNameErrors = ref([])
const commaInputError = ref('')
const isEditDialogOpened = ref(false)
const editDialog = ref(null)
const selectedCityProviders: any[] = reactive([])
const isCityFormOpened = ref(false)
const isProvidersFormOpened = ref(false)
const isAlternativeCityNameFormOpened = ref(false)
const map: any = ref(null)
const mapContainer = ref(null)
const marker: any = ref(null)
const isMapDialogOpen = ref(false)

function updateCity(cityId: number) {
  axios
    .put(`${apiUrl}/api/admin/cities/${cityId}`, updateCityForm)
    .then((response) => {
      if (response.status === 200) {
        toast.success($t('city_update_success'))
        toggleEditDialog()
      }
    })
    .catch((error) => {
      toast.error($t('city_update_error'))
      console.error(error)
    })
}

function storeAlternativeCityName(cityId: number) {
  axios
    .post(`${apiUrl}/api/city-alternative-name`, {
      name: storeCityAlternativeNameForm.name,
      city_id: cityId,
    })
    .then((response) => {
      if (response.status === 201) {
        toast.success($t('add_alt_name_success'))
        storeCityAlternativeNameForm.name = ''
      }
    })
    .catch((error) => {
      toast.error($t('add_alt_name_error'))
      console.error(error)
    })
}

function destroyAlternativeCityName(alternativeCityNameId: number) {
  axios.delete(`${apiUrl}/api/city-alternative-name/${alternativeCityNameId}`)
  toast.success($t('delete_alt_name_success'))
}

function preventCommaInput(event: KeyboardEvent) {
  if (event.key === ',') {
    event.preventDefault()
    commaInputError.value = $t('should_not_contain_comma')
  }
}

function toggleEditDialog() {
  isEditDialogOpened.value = !isEditDialogOpened.value
  commaInputError.value = ''
  isProvidersFormOpened.value = false
  isCityFormOpened.value = false
  isAlternativeCityNameFormOpened.value = false
}

function buildMap() {
  if (!map.value) {
    if (mapContainer.value) {
      map.value = L.map(mapContainer.value)
    }
  }
}

function toggleProviderSelection(provider: string) {
  if (selectedCityProviders.includes(provider)) {
    const index = selectedCityProviders.indexOf(provider)
    selectedCityProviders.splice(index, 1)
  } else {
    selectedCityProviders.push(provider)
  }
}

function updateCityProviders(cityId: number) {
  axios
    .patch(`${apiUrl}/api/update-city-providers/${cityId}`, {
      providerNames: selectedCityProviders,
    })
    .then(() => {
      toast.success($t('update_providers_success'))
    })
    .catch(() => {
      toast.error($t('update_providers_error'))
    })
}

function toggleCityForm() {
  isCityFormOpened.value = !isCityFormOpened.value

  isAlternativeCityNameFormOpened.value = false
  isProvidersFormOpened.value = false
}

function toggleAlternativeCityNameForm() {
  isAlternativeCityNameFormOpened.value = !isAlternativeCityNameFormOpened.value
  isCityFormOpened.value = false
  isProvidersFormOpened.value = false
}

function toggleProvidersForm() {
  isProvidersFormOpened.value = !isProvidersFormOpened.value

  isCityFormOpened.value = false
  isAlternativeCityNameFormOpened.value = false
}

function readMapMarker() {
  if (!marker.value) {
    return
  }
  const latlng = (marker.value as L.Marker).getLatLng()
  updateCityForm.latitude = latlng.lat.toString()
  updateCityForm.longitude = latlng.lng.toString()
}

function showMap() {
  if (!map.value) {
    buildMap()
  }
  map.value.setView(
    [
      parseFloat(updateCityForm.latitude ? updateCityForm.latitude : '0'),
      parseFloat(updateCityForm.longitude ? updateCityForm.longitude : '0'),
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
        parseFloat(updateCityForm.latitude ? updateCityForm.latitude : '0'),
        parseFloat(updateCityForm.longitude ? updateCityForm.longitude : '0'),
      ],
      {
        draggable: true,
        autoPan: true,
        autoPanPadding: [70, 70],
      },
    ).addTo(map.value)
  } else {
    marker.value.setLatLng([
      updateCityForm.latitude ? updateCityForm.latitude : 0,
      updateCityForm.longitude ? updateCityForm.longitude : 0,
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

onClickOutside(editDialog, () => (isMapDialogOpen.value ? '' : (isEditDialogOpened.value = false)))

onMounted(() => {
  props.city.cityProviders?.forEach((provider) => {
    selectedCityProviders.push(provider.provider_name)
  })
})
</script>

<template>
  <td class="relative py-4 pl-4 text-sm sm:pl-6 sm:pr-3">
    <div class="flex items-center font-medium text-gray-800">
      <i :class="'fi-' + country.iso" class="fi rounded h-6 w-8 mr-2" :title="country.name" />
      <p class="cursor-pointer break-all rounded hover:bg-blue-25">
        {{ city.name }}
      </p>
    </div>
    <div v-if="city.latitude" class="mt-1 flex flex-col break-all text-gray-500 sm:block lg:hidden">
      <span>{{ city.latitude }}</span>
      <span class="hidden sm:inline">, </span>
      <br class="hidden sm:inline">
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
          >
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
        class="mx-0.5 mb-1 flex w-fit shrink-0 items-center rounded py-1 pr-2 text-blue-500 hover:bg-blue-25"
        @click="toggleEditDialog"
      >
        <PencilIcon class="h-5 w-8 text-blue-500" />
        {{ $t('edit') }}
      </button>

      <button
        class="mx-0.5 mb-1 flex w-fit shrink-0 items-center rounded py-1 pr-2 text-rose-500 hover:bg-rose-100"
        @click="showDeleteModal = true"
      >
        <TrashIcon class="h-5 w-8 text-rose-500" />
        {{ $t('delete') }}
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
          :class="isCityFormOpened ? 'bg-blue-50' : ''"
          class="mb-3 ml-6 rounded-lg bg-blue-25 px-3 py-1 text-sm font-bold text-gray-800 hover:bg-blue-50"
          @click="toggleCityForm"
        >
          <div class="inline-flex">
            {{ $t('update_city') }}
            <ChevronDownIcon
              class="ml-1 size-5 transition-transform"
              :class="isCityFormOpened ? 'rotate-180' : ''"
            />
          </div>
        </button>
        <form
          v-if="isCityFormOpened"
          class="flex flex-col rounded px-6 text-xs font-bold text-gray-600"
          @submit.prevent="updateCity(city.id)"
        >
          <label class="mb-1 mt-4">{{ $t('name') }}</label>
          <input
            v-model="updateCityForm.name"
            class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
            type="text"
            required
          >
          <ErrorMessage :message="updateCityForm" />
          <div class="flex grow w-full flex-col md:flex-row">
            <div class="flex flex-col w-full md:w-1/2">
              <label class="mb-1 mt-4">{{ $t('latitude') }}</label>
              <input
                v-model="updateCityForm.latitude"
                class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                type="text"
                required
                @keydown="preventCommaInput"
              >
            </div>
            <div class="flex flex-col w-full md:w-1/2">
              <label class="mb-1 mt-4">{{ $t('longitude') }}</label>
              <input
                v-model="updateCityForm.longitude"
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
          <small class="text-rose-600">{{ commaInputError }}</small>

          <div class="flex w-full justify-end">
            <SecondarySaveButton>
              {{ $t('save') }}
            </SecondarySaveButton>
          </div>
        </form>

        <br>
        <button
          :class="isAlternativeCityNameFormOpened ? 'bg-blue-50' : ''"
          class="mb-3 ml-6 rounded-lg bg-blue-25 px-3 py-1 text-sm font-bold text-gray-800 hover:bg-blue-50"
          @click="toggleAlternativeCityNameForm"
        >
          <div class="inline-flex">
            {{ $t('add_alt_name') }}
            <ChevronDownIcon
              class="ml-1 size-5 transition-transform"
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
            <label class="mb-1 mt-4 text-xs font-bold text-gray-600">{{ $t('alt_name') }}</label>
            <input
              v-model="storeCityAlternativeNameForm.name"
              class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
              type="text"
              required
            >
            <!-- <ErrorMessage :message="storeAlternativeCityNameErrors.name" /> -->
            <div class="flex w-full justify-end">
              <SecondarySaveButton>
                {{ $t('save') }}
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
              class="group flex w-fit cursor-pointer break-all rounded py-1 pl-1 pr-3 text-sm font-bold text-zinc-500 hover:bg-blue-25"
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

        <hr v-if="isAlternativeCityNameFormOpened" class="mx-6 my-2 h-px border-0 bg-gray-300">

        <br>
        <button
          :class="isProvidersFormOpened ? 'bg-blue-50' : ''"
          class="ml-6 flex rounded-lg bg-blue-25 px-3 py-1 text-sm font-bold text-gray-800 hover:bg-blue-50"
          @click="toggleProvidersForm"
        >
          <div class="inline-flex">
            {{ $t('providers') }}
            <ChevronDownIcon
              class="ml-1 size-5 transition-transform"
              :class="isProvidersFormOpened ? 'rotate-180' : ''"
            />
          </div>
        </button>

        <div v-if="isProvidersFormOpened" class="mt-4 flex flex-col rounded border-blue-100 px-6">
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
              <input v-model="selectedCityProviders" class="hidden" type="checkbox">
              <label class="cursor-pointer">
                <img
                  class="w-10"
                  :src="'/providers/' + provider.name.toLowerCase() + '.png'"
                  alt=""
                >
              </label>
            </div>
          </div>
          <div class="flex w-full justify-end text-xs">
            <SecondarySaveButton @click="updateCityProviders(city.id)">
              {{ $t('save') }}
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
</template>
