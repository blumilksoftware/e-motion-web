<script setup>
import { HeartIcon as OutlineHeartIcon } from '@heroicons/vue/24/outline'
import { toast } from 'vue3-toastify'
import { i18n } from '@/main.ts'
const $t = i18n.global.t

</script>

<template>
  <span @click.stop="toast.info($t('Log in to add to favorites.'))">
    <OutlineHeartIcon class="size-8 text-gray-500 sm:size-6" />
  </span>
</template>
