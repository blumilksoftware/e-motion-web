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
    class="size-10 m-3 hover:before:w-64 z-10 flex rounded-full relative before:whitespace-nowrap before:text-right shadow-md bg-white before:content-[attr(hint)] before:absolute before:h-10 before:-translate-x-full before:place-content-center before:overflow-hidden before:block before:transition-all before:w-0 before:-left-4 before:z-0 before:text-white before:drop-shadow-[0_1.2px_3px_rgba(0,0,0,1)]"
  >
    <slot />
  </button>
</template>
