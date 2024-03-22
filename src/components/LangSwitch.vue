<script setup lang="ts">
import { usePage } from "@inertiajs/vue3";
import { computed } from "vue";
import store from "@/store/sessionData";
const locales = [
  {
    name: "Polski",
    lang: "pl",
    iso: "pl",
  },
  {
    name: "English",
    lang: "en",
    iso: "gb",
  },
];

const changeLocale = (locale) => {
  store.commit("setLocale", locale);
};

const currentLocale = computed(() => store.state.locale);
</script>

<template>
  <div class="flex space-x-2 pt-1.5">
    <button
      v-for="locale in locales"
      :key="locale.lang"
      @click="
        changeLocale(locale.lang);
        console.log(`${locale.lang}`);
      "
      :class="[currentLocale === locale.lang ? 'opacity-10' : 'opacity-30']"
      :disabled="currentLocale === locale.lang"
    >
      {{ locale.name }}
      <i
        :class="`${locale.iso} flat flag`"
        class="!h-[24px] !w-[36px] rounded md:!h-[18px] md:!w-[27px]"
      />
    </button>
  </div>
</template>
