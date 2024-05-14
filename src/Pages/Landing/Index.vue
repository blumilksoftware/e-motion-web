<script setup lang="ts">
import MapView from '@/layouts/MapView.vue'
import fStore from '@/store/FilterStore'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import SearchPanel from './SearchPanel.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { XMarkIcon, MapIcon } from '@heroicons/vue/24/outline'
import { usePage } from '@inertiajs/vue3'
import axios from 'axios'
import SearchPanelScaffolding from '@/layouts/SearchPanelScaffolding.vue'
import store from '@/store/SessionData'
import { apiUrl } from '@/main'
const breakpoints = useBreakpoints(breakpointsTailwind)
const showInfo = ref(true)
const isMobile = ref(breakpoints.smaller('lg'))
const isDesktop = ref(breakpoints.greaterOrEqual('lg'))
const shouldShowMap = ref(false)

function switchPanel() {
  showInfo.value = !showInfo.value
}

const map = ref(false)
function toggleMap() {
  map.value = !map.value
}
const nav = ref(null)

const page = usePage()
const isAuth = ref(store.state.auth.isAuth)

const dataIsFetched = ref(false)

function fetchData() {
  if (!fStore.state.citiesWithProviders.providers.length) {
    axios
      .get(`${apiUrl}/api/providers`)
      .then((response) => {
        fStore.commit('saveCitiesWithProviders', response)
      })
      .finally(() => {
        dataIsFetched.value = true
      })
  } else {
    dataIsFetched.value = true
  }
}

const data = reactive(fStore.state.citiesWithProviders)

onMounted(() => {
  fetchData()
  watch(
    () => fStore.state.selectedCity,
    () => {
      window.scrollTo(0, 0)
    }
  )
  watch(
    () => store.state.auth.isAuth,
    () => {
      isAuth.value = store.state.auth.isAuth
    }
  )
})

const buttonIcon = computed(() => {
  return shouldShowMap.value ? XMarkIcon : MapIcon
})

const buttonAnimation = computed(() => {
  return fStore.state.selectedCity && buttonIcon.value === MapIcon ? 'animate-bounce' : ''
})

onUnmounted(() => {
  fStore.commit('changeSelectedCity', null)
})
</script>

<template>
  <div class="flex h-full relative overflow-hidden flex-col">
    <div class="flex grow flex-col lg:flex-row">
      <div
        class="size-full grow rounded-lg overflow-hidden lg:w-1/2 transition-all z-0 absolute lg:left-0 bg-white"
        :class="!map ? 'left-0' : '-left-full'"
      >
        <div class="size-full overflow-auto">
          <SearchPanel
            v-if="dataIsFetched"
            :cities="data.cities"
            :providers="data.providers"
            :countries="data.countries"
            :is-auth="isAuth"
          />
          <SearchPanelScaffolding v-else />
        </div>
      </div>

      <div
        class="size-full rounded-lg overflow-hidden lg:w-1/2 transition-all z-0 absolute lg:right-0 bg-white"
        :class="map ? 'right-0' : '-right-full'"
      >
        <MapView
          v-if="dataIsFetched"
          :key="fStore.state.selectedProviderName || undefined"
          :cities="data.cities"
          class="z-10 fixed bottom-0 right-0"
        />
        <div
          v-else
          class="flex h-full flex-col items-center justify-center bg-blue-25"
          aria-label="Loading..."
          role="status"
        >
          <svg class="size-24 animate-spin" viewBox="3 3 18 18">
            <path
              class="fill-gray-200"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            />
            <path
              class="fill-gray-800"
              d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
            />
          </svg>
          <p class="mt-4 text-xs font-medium text-gray-400">
            {{ $t('filling_map') }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <button
    class="fixed z-50 lg:hidden bottom-8 left-1/2 -translate-x-1/2 rounded-full aspect-square bg-white shadow-md p-2"
    :title="!map ? $t('show_map') : $t('hide_map')"
    @click="toggleMap()"
  >
    <MapIcon v-if="!map" class="size-6" aria-hidden="true" />
    <XMarkIcon v-else class="size-6" aria-hidden="true" />
  </button>
</template>
