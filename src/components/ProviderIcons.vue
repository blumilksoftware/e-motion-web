<script setup>
const props = defineProps({
  item: Object,
  providers: Object,
  apps: Object,
})
import { ref, reactive } from 'vue'

const showProviderButtons = ref(false)
function getProviderColor(providerName) {
  const provider = props.providers.find((provider) => provider.name === providerName)
  return provider ? provider.color : ''
}

function getProviderURLs(providerName) {
  const provider = props.providers.find((provider) => provider.name === providerName)
  urls.pname = provider.name
  urls.url = provider.url ? provider.url : null
  urls.android_url = provider.android_url ? provider.android_url : null
  urls.ios_url = provider.ios_url ? provider.ios_url : null
}

if (window.location.pathname.includes('/city')) {
  document.addEventListener('click', function (event) {
    const providerButtons = document.querySelector('.provider-buttons')

    if (
      !event.target.closest('.provider-buttons > div') &&
      !event.target.closest('.provider-icon')
    ) {
      if (document.querySelector('.provider-buttons')) {
        setTimeout(() => {
          document.querySelector('.provider-buttons').classList.remove('show')
          urls.hidden = true
        }, 150)
        urls.transparent = true
      }
    }

    if (event.target.closest('.provider-icon')) {
      getProviderURLs(event.target.closest('.provider-icon').getAttribute('pname'))

      if (urls.url || urls.android_url || urls.ios_url) {
        providerButtons.classList.add('show')
        urls.hidden = false
        urls.transparent = false
      }
    }
  })
}
const buttonsclass =
  'text-white after:opacity-0 after:inline-block after:ml-2 after:transition after:border-transparent after:border-l-white  after:translate-y-0.5 after:border-8 after:border-solid after:size-0'
const urls = reactive({
  pname: null,
  url: null,
  android_url: null,
  ios_url: null,
  hidden: true,
  transparent: true,
})
</script>

<template>
  <div
    class="z-0 mb-2 mr-3 mt-4 flex w-fit flex-row-reverse flex-wrap items-center justify-end sm:mt-0 sm:justify-start"
  >
    <div
      v-for="cityProvider in item.cityProviders"
      :key="cityProvider.provider_name"
      class="w-[72px]"
    >
      <div
        :style="{ 'background-color': getProviderColor(cityProvider.provider_name) }"
        class="provider-icon z-0 m-3 mr-5 flex h-7 w-fit scale-150 items-center justify-center rounded-md p-1 lg:h-8"
        onclick=""
        :pname="cityProvider.provider_name"
      >
        <img
          loading="lazy"
          class="w-7 lg:w-8"
          :src="'/providers/' + cityProvider.provider_name.toLowerCase() + '.png'"
          alt=""
        >
      </div>
    </div>
  </div>
  <div
    class="provider-buttons block h-[200vh] w-screen fixed -translate-x-1/2 -translate-y-1/2 z-50 bg-black/50"
  >
    <div
      class="z-30 absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 size-fit border border-solid bg-white shadow-lg transition rounded flex-col flex gap-2 margin-2 p-2"
    >
      <p class="text-center text-lg text-blue-500">
        {{ urls.pname }}
      </p>
      <a
        v-if="urls.url"
        :href="urls.url"
        target="_blank"
        class="flex h-11 w-36 flex-row place-items-center justify-items-center rounded bg-blue-400 [&>p]:hover:after:opacity-100"
      >
        <img loading="lazy" class="mx-2 w-6" src="/icons/globe.svg" alt="">
        <p :class="buttonsclass">Web</p>
      </a>
      <a
        v-if="urls.android_url"
        :href="urls.android_url"
        target="_blank"
        class="flex h-11 w-36 flex-row place-items-center justify-items-center rounded bg-blue-400 [&>p]:hover:after:opacity-100"
      >
        <img loading="lazy" class="mx-2 w-6" src="/icons/android.svg" alt="">
        <p :class="buttonsclass">Android</p>
      </a>
      <a
        v-if="urls.ios_url"
        :href="urls.ios_url"
        target="_blank"
        class="flex h-11 w-36 flex-row place-items-center justify-items-center rounded bg-blue-400 [&>p]:hover:after:opacity-100"
      >
        <img loading="lazy" class="mx-2 w-6" src="/icons/apple.svg" alt="">
        <p :class="buttonsclass">AppStore</p>
      </a>
    </div>
  </div>
</template>

<style>
/* .provider-buttons {
  opacity: 0;
  visibility: hidden;
  padding: 8px;
  z-index: 50;
  & > a {
    margin-bottom: 4px;
    position: relative;
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
.provider-buttons.show {
  transform: translate(-50%, -50%);
  opacity: 1;
  visibility: visible;
  top: 30%;
  left: 50%;
  scale: 1;
}
.provider-text::after {
  margin-left: 4px;
  content: '';
  display: inline-block;
  border: 8px solid transparent;
  border-left-color: #fff;
  opacity: 0;
  transition: all 0.15s ease-in-out;
  height: 0px;
}
a > .provider-text {
  transition: all 0.15s ease-in-out;
  transform: scale(1);
}
a:hover > .provider-text {
  text-decoration: none;
  transform: scale(1.1);
}
a:hover > .provider-text::after {
  opacity: 1;
}
.provider-buttons > a:hover {
  box-shadow: inset 0 0 8px 1px #315cb8c5;
}
.provider-buttons > a {
  transition: all 0.15s ease-in-out;
} */
</style>
