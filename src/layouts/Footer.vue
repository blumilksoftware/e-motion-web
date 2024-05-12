<script setup>
import { ref } from 'vue'

const getCurrentYear = () => {
  return ref(new Date().getFullYear())
}
</script>

<template>
  <footer>
    <div class="bottom-0 text-xs font-thin text-blue-600">{{ getCurrentYear() }} &copy; blue</div>
  </footer>
</template>
