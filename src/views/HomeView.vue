<script setup lang="ts">
import MapView from '@/layouts/MapView.vue'
import { ref } from 'vue'
import { MapIcon } from '@heroicons/vue/24/outline'
const map = ref(false)
function toggleMap() {
  map.value = !map.value
}
</script>
<template>
  <div class="h-full w-full lg:w-1/2 transition-all absolute lg:left-0 bg-white" :class="!map ? 'left-0' : '-left-full'">
    {{ $t('main') }}
  </div>
  <div class="h-full w-full lg:w-1/2 transition-all absolute lg:right-0 bg-white" :class="map ? 'right-0' : '-right-full'">
    <map-view />
  </div>
  <button
    class="fixed z-10 lg:hidden bottom-16 left-1/2 -translate-x-1/2 rounded-full aspect-square bg-white shadow-md p-2"
    :title="!map ? $t('showMap') : $t('hideMap')"
    @click="toggleMap()"
  >
    <MapIcon class="size-6" aria-hidden="true" />
  </button>
</template>
