<script setup>
import { i18n } from '@/main';
const $t = i18n.global.t
const props = defineProps({
  meta: Object,
})
</script>

<template>
  <div class="flex items-center justify-between bg-white py-3 ">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ $t('Showing') }}
          <span class="font-medium">{{ props.meta.from }}</span>
          {{ $t('to') }}
          <span class="font-medium"> {{ props.meta.to }}</span>
          {{ $t('of') }}
          <span class="font-medium">{{ props.meta.total }}</span>
          {{ $t('results') }}
        </p>
      </div>
    </div>
  </div>
</template>
