<script setup>
import { defineProps } from 'vue'

defineProps({
  message: {
    type: String,
    default: 'error',
  },
})
</script>
defineProps({
  message: {
    type: String,
  },
})
</script>

<template>
  <div v-if="message" class="mt-1 text-xs text-red-500">
    {{ message }}
  </div>
</template>

