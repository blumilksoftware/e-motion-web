<script setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, onUnmounted, ref } from 'vue'
import { InformationCircleIcon, MapIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import FavoriteButton from '@/components/FavoriteButton.vue'
import InfoPopup from '@/components/InfoPopup.vue'
import { apiUrl, i18n } from '@/main'
import SelectedCity from '@/components/SelectedCity.vue'
import ProviderIcons from '@/components/ProviderIcons.vue'
import fStore from '@/store/FilterStore'
import axios from 'axios'
import store from '@/store/SessionData'
import { reactive } from 'vue'
import MapView from '@/layouts/MapView.vue'
import router from '@/router'
const $t = i18n.global.t
const map = ref(false)
const cities = ref({})
const providers = ref([])
const isAuth = ref(store.state.auth.isAuth)
const dataIsFetched = ref(false)
if (!isAuth.value) {
  router.push('/')
}

axios.get(`${apiUrl}/api/favorite-cities`).then((response) => {
  cities.value = response.data.cities
  providers.value = response.data.providers
  dataIsFetched.value = true
})

const buttonIcon = computed(() => {
  return shouldShowMap.value ? XMarkIcon : MapIcon
})

function showCity(city) {
  if (fStore.state.selectedCity && fStore.state.selectedCity.id === city.id) {
    fStore.commit('changeSelectedCity', null)
  } else {
    fStore.commit('changeSelectedCity', city)
  }
}

const buttonAnimation = computed(() => {
  return fStore.state.selectedCity && buttonIcon.value === MapIcon ? 'animate-bounce' : ''
})
function toggleMap() {
  map.value = !map.value
}
onUnmounted(() => {
  fStore.commit('changeSelectedCity', null)
})
</script>

<template>
  <div class="flex h-full relative overflow-hidden flex-col">
    <div class="flex grow flex-col lg:flex-row">
      <div
        class="size-full rounded-lg overflow-y-auto p-4 lg:w-1/2 transition-all z-0 absolute lg:left-0 bg-white"
        :class="!map ? 'left-0' : '-left-full'"
      >
        <h1 class="mb-2 px-2 text-3xl font-bold md:mb-10 md:text-4xl">
          {{ $t('favorite_cities') }}
        </h1>
        <SelectedCity :providers="providers" />

        <DynamicScroller
          v-if="cities.length"
          :items="cities"
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
                      {{ $t('check_details') }}
                    </p>
                  </router-link>
                </div>
              </div>
              <ProviderIcons :item="item" :providers="providers" />
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>

        <p v-else class="mt-3 flex px-2 text-lg font-medium text-gray-500">
          {{ $t(`did_not_find_anything`) }}
        </p>
      </div>

      <div
        class="size-full rounded-lg overflow-hidden lg:w-1/2 transition-all z-0 absolute lg:right-0 bg-white"
        :class="map ? 'right-0' : '-right-full'"
      >
        <MapView
          v-if="dataIsFetched"
          :key="fStore.state.selectedProviderName || undefined"
          :cities="cities"
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
