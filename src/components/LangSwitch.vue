<script setup lang="ts">
import { computed } from 'vue'
import '@/../node_modules/flag-icons/css/flag-icons.min.css'
import store from '@/store/SessionData'

const locales = [
  {
    name: 'Polski',
    lang: 'pl',
    iso: 'pl',
  },
  {
    name: 'English',
    lang: 'en',
    iso: 'gb',
  },
]

const changeLocale = (locale: string) => {
  store.commit('setLocale', locale)
}

const currentLocale = computed(() => store.state.locale)
</script>

<template>
  <div class="flex space-x-2 pt-1.5" @loadstart="$i18n.locale = currentLocale">
    <button
      v-for="locale in locales"
      :key="locale.lang"
      :class="[currentLocale === locale.lang ? 'opacity-100' : 'opacity-30']"
      :disabled="currentLocale === locale.lang"
      @click="changeLocale(locale.lang), ($i18n.locale = locale.lang)"
    >
      <i
        :class="`fi-${locale.iso} flat fi`"
        class="!h-[24px] !w-[36px] rounded md:!h-[18px] md:!w-[27px]"
      />
    </button>
  </div>
</template>
@/store/SessionData @/store/SessionData
