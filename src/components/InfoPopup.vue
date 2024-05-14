<script setup>
import { HeartIcon as OutlineHeartIcon } from '@heroicons/vue/24/outline'
import { toast } from 'vue3-toastify'
import { i18n } from '@/main.ts'
const $t = i18n.global.t
</script>

<template>
  <span @click.stop="toast.info($t('log_in_to_fav'))">
    <OutlineHeartIcon class="size-8 text-gray-500 sm:size-6" />
  </span>
</template>
