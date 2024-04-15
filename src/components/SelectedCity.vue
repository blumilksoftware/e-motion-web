<script setup>
import fStore from '@/store/FilterStore'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import ProviderIcons from './ProviderIcons.vue'

const props = defineProps({
  providers: Object
})

function showCity(city) {
  if (fStore.selectedCity && fStore.selectedCity.id === city.id) {
    fStore.changeSelectedCity(null)
  } else {
    fStore.changeSelectedCity(city)
  }
}

function goToCityPage(city) {
  router.get(`/${city.country.slug}/${city.slug}`)
}
</script>

<template>
  <div
    v-if="fStore.selectedCity"
    class="group mb-4 flex origin-left cursor-pointer flex-col justify-between gap-x-6 rounded-lg border border-gray-100 shadow-md transition-all duration-500 ease-out hover:shadow-lg hover:drop-shadow-xl sm:flex-row md:items-center"
    @click="showCity(fStore.selectedCity)"
  >
    <div
      class="flex w-full justify-between px-2 py-6 pb-1 sm:flex-col sm:justify-start sm:pb-4 lg:px-3"
    >
      <div class="flex w-max items-center">
        <i :class="fStore.selectedCity.country.iso" class="flat flag huge shrink-0" />

        <div class="ml-3 flex flex-col justify-start">
          <p
            class="mr-2 origin-left break-all rounded-full font-bold transition-all duration-500 ease-out group-hover:text-gray-500"
          >
            {{ fStore.selectedCity.name }}
          </p>
          <p class="break-all text-xs font-semibold text-blumilk-500">
            {{ fStore.selectedCity.country.name }}
          </p>
        </div>
      </div>
      <div class="mt-0 flex w-fit items-center justify-end sm:mt-1 sm:justify-start">
        <div class="mt-2 flex rounded-full text-gray-600 sm:ml-[64px]">
          <div
            class="flex items-center rounded-full py-0.5 text-blumilk-500 hover:drop-shadow"
            @click.stop="goToCityPage(fStore.selectedCity)"
          >
            <InformationCircleIcon class="h-8 w-8 hover:drop-shadow sm:h-6 sm:w-6" />
            <p class="ml-1 hidden text-xs font-medium sm:flex">
              {{ __('Check details') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <ProviderIcons :item="fStore.selectedCity" :providers="props.providers" />
  </div>
</template>
