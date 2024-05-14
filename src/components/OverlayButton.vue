<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
  hint: String
})
</script>

<template>
  <button
    type="button"
    :hint="props.hint"
    class="size-10 m-3 hover:before:w-48 z-10 flex rounded-full relative before:whitespace-nowrap before:text-right shadow-md bg-white before:content-[attr(hint)] before:absolute before:h-10 before:-translate-x-full before:place-content-center before:overflow-hidden before:block before:transition-all before:bg-gradient-to-l before:from-white before:pr-3 before:opacity-0 hover:before:opacity-100 before:rounded-md before:to-transparent before:w-0 before:-left-4 before:z-0 before:text-black before:drop-shadow-[0_0_0.5rem_rgba(255,255,255,5)]"
  >
    <slot />
  </button>
</template>
