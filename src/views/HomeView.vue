<script setup lang="ts">
import fStore from '@/store/FilterStore'
import MapView from '@/layouts/MapView.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { MapIcon } from '@heroicons/vue/24/outline'
const map = ref(false)
function toggleMap() {
  map.value = !map.value
}
onMounted(() => {
  watch(
    () => fStore.state.dataIsFetched,
    () => {
      map.value = false
    },
  )
})
const data = reactive(fStore.state.citiesWithProviders)

</script>

<template>
  <div
    class="size-full rounded-lg overflow-hidden lg:w-1/2 transition-all z-0 absolute lg:left-0 bg-white"
    :class="!map ? 'left-0' : '-left-full'"
  >
    <router-view />
  </div>
  <div
    class="size-full rounded-lg overflow-hidden lg:w-1/2 transition-all z-0 absolute lg:right-0 bg-white"
    :class="map ? 'right-0' : '-right-full'"
  >
    <map-view v-if="fStore.state.dataIsFetched" :key="fStore.state.selectedProviderName ?? ''" :cities="data.cities" />
  </div>
  <button
    class="fixed z-10 lg:hidden bottom-16 left-1/2 -translate-x-1/2 rounded-full aspect-square bg-white shadow-md p-2"
    :title="!map ? $t('show_map') : $t('hide_map')"
    @click="toggleMap()"
  >
    <MapIcon class="size-6" aria-hidden="true" />
  </button>
</template>
