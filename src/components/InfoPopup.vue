<script setup>
import { HeartIcon as OutlineHeartIcon } from '@heroicons/vue/24/outline'
import { toast } from 'vue3-toastify'

  toast.info(__('Log in to add to favorites.'))


</script>

<template>
  <span @click.stop="showToast">
    <OutlineHeartIcon class="h-8 w-8 text-gray-500 sm:h-6 sm:w-6" />
  </span>
</template>
