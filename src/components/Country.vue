<script setup lang="ts">
import { PencilIcon, TrashIcon, XMarkIcon, FolderIcon, MapIcon } from '@heroicons/vue/24/outline'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { onClickOutside } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import DeleteModal from '@/components/DeleteModal.vue'
import { apiUrl, i18n } from '@/main'
import OverlayButton from '@/components/OverlayButton.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ref } from 'vue'
import axios from 'axios'
import SecondarySaveButton from '@/components/SecondarySaveButton.vue'
const $t = i18n.global.t

const showDeleteModal = ref(false)
const props = defineProps({
  country: {
    type: Object,
    required: true
  }
})

const map: any = ref(null)
const mapContainer = ref(null)
const marker: any = ref(null)
const isMapDialogOpen = ref(false)

const destroyCountry = (countryId: number) => {
  axios
    .delete(`${apiUrl}/api/admin/countries/${countryId}`, {})
    .then(() => {
      toast.success($t('country_delete_success'))
    })
    .catch(() => {
      toast.error($t('country_delete_error'))
    })
  showDeleteModal.value = false
}

function updateData() {
  props.country.name = updateCountryForm.name
  props.country.alternativeName = updateCountryForm.alternativeName
  props.country.latitude = updateCountryForm.latitude
  props.country.longitude = updateCountryForm.longitude
  props.country.iso = updateCountryForm.iso
}

function updateCountry(countryId: number) {
  axios
    .patch(`${apiUrl}/api/admin/countries/${countryId}`, updateCountryForm)
    .then(() => {
      toast.success($t('update_country_success'))
      isEditDialogOpened.value = false
      updateData()
    })
    .catch(() => {
      toast.error($t('update_country_error'))
    })
}
const updateCountryForm = {
  name: props.country.name,
  alternativeName: props.country.alternativeName,
  latitude: props.country.latitude,
  longitude: props.country.longitude,
  iso: props.country.iso
}

const commaInputError = ref('')

function preventCommaInput(event: KeyboardEvent) {
  if (event.key === ',') {
    event.preventDefault()
    commaInputError.value = $t('shold_not_contain_comma')
  }
}

const isEditDialogOpened = ref(false)
const editDialog = ref(null)
onClickOutside(editDialog, () => (isMapDialogOpen.value ? '' : (isEditDialogOpened.value = false)))

function toggleEditDialog() {
  isEditDialogOpened.value = !isEditDialogOpened.value
  commaInputError.value = ''
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
  updateCountryForm.latitude = latlng.lat.toString()
  updateCountryForm.longitude = latlng.lng.toString()
}

function showMap() {
  if (!map.value) {
    buildMap()
  }
  map.value.setView(
    [
      parseFloat(updateCountryForm.latitude ? updateCountryForm.latitude : '0'),
      parseFloat(updateCountryForm.longitude ? updateCountryForm.longitude : '0')
    ],
    6
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
        parseFloat(updateCountryForm.latitude ? updateCountryForm.latitude : '0'),
        parseFloat(updateCountryForm.longitude ? updateCountryForm.longitude : '0')
      ],
      {
        draggable: true,
        autoPan: true,
        autoPanPadding: [70, 70]
      }
    ).addTo(map.value)
  } else {
    marker.value.setLatLng([
      updateCountryForm.latitude ? updateCountryForm.latitude : 0,
      updateCountryForm.longitude ? updateCountryForm.longitude : 0
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
  <td class="relative py-4 pl-4 text-sm sm:pl-6 sm:pr-3">
    <div class="flex items-center font-medium text-gray-800">
      <i :class="'fi-' + country.iso" class="fi mr-2 h-6 w-8 rounded" />
      <p class="cursor-pointer break-all rounded hover:bg-blue-25">
        {{ country.name }}
      </p>
    </div>
    <div class="mt-1 flex flex-col break-all text-gray-500 xl:hidden">
      <span>{{ country.latitude }},</span>
      <span>{{ country.longitude }}</span>
    </div>
  </td>
  <td class="table-cell break-all py-3.5 text-sm text-gray-500">
    {{ country.alternativeName }}
  </td>
  <td class="hidden break-all py-3.5 pl-1 text-sm text-gray-500 xl:table-cell">
    {{ country.latitude }}
  </td>

  <td class="hidden break-all py-3.5 pl-1 text-sm text-gray-500 xl:table-cell">
    {{ country.longitude }}
  </td>

  <td class="hidden break-all py-3.5 pl-1 text-sm text-gray-500 xl:table-cell">
    {{ country.iso }}
  </td>

  <td
    class="relative table-cell justify-end border-t text-right text-xs font-medium sm:pl-3 md:pr-2 xl:pr-0"
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
        :name="country.name"
        :type="'Country'"
        @close="showDeleteModal = false"
        @delete="destroyCountry(country.id)"
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

        <form
          class="flex flex-col rounded px-6 text-xs font-bold text-gray-600"
          @submit.prevent="updateCountry(country.id)"
        >
          <label class="mb-1">{{ $t('name') }}</label>
          <input
            v-model="updateCountryForm.name"
            class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
            type="text"
            required
          />
          <label class="mb-1 mt-4">{{ $t('alt_name') }}</label>
          <input
            v-model="updateCountryForm.alternativeName"
            class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
            type="text"
          />

          <div class="flex grow w-full flex-col md:flex-row">
            <div class="flex flex-col w-full md:w-1/2">
              <label class="mb-1 mt-4">{{ $t('latitude') }}</label>
              <input
                v-model="updateCountryForm.latitude"
                class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
                type="text"
                required
                @keydown="preventCommaInput"
              />
            </div>
            <div class="flex flex-col w-full md:w-1/2">
              <label class="mb-1 mt-4">{{ $t('longitude') }}</label>
              <input
                v-model="updateCountryForm.longitude"
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
          <label class="mb-1 mt-4">ISO</label>
          <input
            v-model="updateCountryForm.iso"
            class="rounded border border-blue-100 p-4 text-sm font-semibold text-gray-800 shadow md:p-3"
            type="text"
            required
          />
          <small class="text-rose-600">{{ commaInputError }}</small>

          <div class="flex w-full justify-end">
            <SecondarySaveButton>
              {{ $t('save') }}
            </SecondarySaveButton>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
    v-show="isMapDialogOpen"
    class="fixed inset-0 z-50 flex items-center"
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
