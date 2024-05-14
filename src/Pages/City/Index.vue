<script setup lang="ts">
import MapView from '@/layouts/MapView.vue'
import router from '@/router/index'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { computed, onUnmounted, ref, reactive } from 'vue'
import {
  MapIcon,
  XMarkIcon,
  StarIcon,
  PaperAirplaneIcon,
  ArrowDownIcon,
} from '@heroicons/vue/24/outline'
import fStore from '@/store/FilterStore'
import FavoriteButton from '@/components/FavoriteButton.vue'
import ProviderIcons from '@/components/ProviderIcons.vue'
import InfoPopup from '@/components/InfoPopup.vue'
import Opinion from '@/components/Opinion.vue'
import axios from 'axios'
import store from '@/store/SessionData'
import { toast } from 'vue3-toastify'
import { i18n, apiUrl } from '@/main'
const $t = i18n.global.t
const dataIsFetched = ref(false)
const $route = router.currentRoute.value
const isAuth = computed(() => store.state.auth.isAuth)
const regulationsOpen = ref(false)
const rules = reactive({ pl: '', en: '' })
fetchRegulations()
let data = {
  city: {
    id: 0,
    name: '',
    slug: '',
    latitude: '',
    longitude: '',
    city_alternative_names: [],
    cityProviders: [],
    country: {
      id: 0,
      name: '',
      slug: '',
      alternative_name: null,
      latitude: '',
      longitude: '',
      iso: '',
      created_at: '',
      updated_at: '',
    },
    cityOpinions: [],
  },
  providers: [],
  cityOpinions: [],
}
fetchCityData()
const map = ref(false)
function toggleMap() {
  map.value = !map.value
}
const currentLocale = ref(computed(() => store.state.locale))
const currentRules = ref(computed(() => rules[currentLocale.value as keyof typeof rules]))

const shouldShowMap = ref(false)

onUnmounted(() => {
  fStore.commit('changeSelectedCity', null)
})

const opinionForm = reactive({
  rating: '',
  content: '',
  city_id: data.city.id,
})

const maxRating = 5

function setRating(starIndex: number) {
  opinionForm.rating = starIndex.toString()
}

function fetchCityData() {
  axios
    .get(`${apiUrl}/api/${$route.params.country}/${$route.params.city}`)
    .then((response) => {
      data = response.data
      return
    })
    .finally(() => {
      dataIsFetched.value = true
    })
    .catch(() => {
      toast.error($t('fetching_error'))
    })
}
function toggleRegulations() {
  regulationsOpen.value = !regulationsOpen.value
}
function fetchRegulations() {
  axios
    .get(`${apiUrl}/api/rules/${$route.params.country}/${$route.params.city}`)
    .then((response) => {
      rules.pl = response.data.rulesPL
      rules.en = response.data.rulesEN
      return
    })
    .catch(() => {
      toast.error($t('fetching_error'))
    })
}

const emptyRatingError = ref('')

function createOpinion() {
  if (opinionForm.rating === '0') {
    emptyRatingError.value = $t('no_rating_error')
  } else {
    axios
      .post(`${apiUrl}/api/opinions`, {
        rating: opinionForm.rating,
        content: opinionForm.content,
        city_id: data.city.id.toString(),
      })
      .then(() => {
        opinionForm.content = ''
        toast.success($t('add_opinion_success'))
        emptyRatingError.value = ''
        return
      })
      .catch(() => {
        toast.error($t('add_opinion_error'))
        emptyRatingError.value = ''
      })
  }
}
</script>

<template>
  <div v-if="dataIsFetched" class="flex h-screen flex-col">
    <div class="flex grow flex-col lg:flex-row">
      <div
        class="size-full grow rounded-lg overflow-hidden lg:w-1/2 transition-all z-0 absolute lg:left-0 bg-white"
        :class="!map ? 'left-0' : '-left-full'"
      >
        <div class="mx-auto mt-4 flex w-11/12 flex-col sm:mt-12">
          <div class="flex items-end justify-between md:items-center">
            <h1 class="flex text-4xl font-bold md:text-5xl">
              {{ data.city.name }}
            </h1>
            <div class="hover:drop-shadow">
              <FavoriteButton
                v-if="isAuth"
                :cityid="data.city.id"
                :grow-up="true"
                class="ml-3 flex hover:drop-shadow"
              />
              <InfoPopup v-else class="flex rounded-full hover:drop-shadow" />
            </div>
          </div>

          <div class="mt-3 flex items-center">
            <i
              class="flat fi h-9 w-12 shadow rounded ml-1"
              :class="`fi-${data.city.country.iso}`"
            />
            <h2 class="ml-2 text-xl font-medium text-blue-500">
              {{ data.city.country.name }}
            </h2>
          </div>
          <h2 class="ml-1 mt-1 text-sm text-gray-400">
            {{ data.city.latitude }}, {{ data.city.longitude }}
          </h2>
          <ProviderIcons :class="'pt-4 relative z-10'" :item="data.city" :providers="data.providers" />

          <div
            class="regulations relative z-0 overflow-hidden rounded border border-solid border-gray-200 px-3"
          >
            <div
              class="my-3 flex cursor-pointer items-center text-2xl font-bold text-gray-700"
              @click="toggleRegulations()"
            >
              {{ $t('rules') }}
              <ArrowDownIcon
                :class="regulationsOpen ? 'rotated' : ''"
                class="absolute right-3 inline-block size-6 transition-all"
              />
            </div>
            <div :class="regulationsOpen ? 'show' : ''" class="overflow-scroll transition">
              <div
                v-if="currentRules == ''"
                :class="regulationsOpen ? 'show' : ''"
                class="overflow-scroll transition"
              >
                <p class="animate-pulse text-gray-400">{{ $t('loading_rules_info') }}...</p>
              </div>
              <div
                v-else
                :class="regulationsOpen ? 'show' : ''"
                class="overflow-scroll transition"
                style="white-space: pre-line"
              >
                {{ currentRules }}
              </div>
            </div>
          </div>

          <form v-if="isAuth" class="mt-8 flex flex-col" @submit.prevent="createOpinion">
            <p class="mb-2 text-xs font-medium text-gray-700">
              {{ $t('add_opinion') }}
            </p>
            <div class="mb-2 flex items-center space-x-1">
              <StarIcon
                v-for="index in maxRating"
                :key="index"
                class="size-6 cursor-pointer text-yellow-400"
                :class="{ 'fill-yellow-400': index <= parseInt(opinionForm.rating) }"
                @click="setRating(index)"
              />
            </div>
            <textarea
              v-model.trim="opinionForm.content"
              required
              class="h-32 w-full rounded-lg border border-gray-300"
              @keydown.enter.prevent="createOpinion"
            />

            <div class="mt-1 flex flex-col" />

            <button
              class="mt-2 flex w-full items-center justify-center rounded-lg bg-emerald-500 p-3 text-xs font-medium text-white hover:bg-emerald-600 sm:w-fit sm:px-4 sm:py-2"
            >
              {{ $t('send') }}
              <PaperAirplaneIcon class="ml-2 size-4" />
            </button>
          </form>

          <div v-if="data.cityOpinions.length" class="mt-6">
            <p class="mb-2 text-xs font-medium text-gray-700">
              {{ $t(`users_opinions`) }}
            </p>
            <div
              v-for="opinion in data.cityOpinions"
              :key="opinion"
              class="mb-3 flex flex-col rounded-lg border border-gray-300 p-2"
            >
              <Opinion :opinion="opinion" :city-id="data.city.id" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="size-full rounded-lg overflow-hidden lg:w-1/2 transition-all z-0 absolute lg:right-0 bg-white"
        :class="map ? 'right-0' : '-right-full'"
      >
        <MapView
          v-if="dataIsFetched"
          :cities="[data.city]"
          :is-city-page="true"
          class="z-10 fixed bottom-0 right-0"
        />
        <div
          v-else
          class="flex h-full flex-col items-center justify-center bg-blue-25"
          aria-label="Loading..."
          role="status"
        >
          <svg class="size-24 animate-spin" viewBox="3 3 18 18">
            <path
              class="fill-gray-200"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            />
            <path
              class="fill-gray-800"
              d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
            />
          </svg>
          <p class="mt-4 text-xs font-medium text-gray-400">
            {{ $t('filling_map') }}
          </p>
        </div>
      </div>
      <button
        class="fixed z-50 lg:hidden bottom-8 left-1/2 -translate-x-1/2 rounded-full aspect-square bg-white shadow-md p-2"
        :title="!map ? $t('show_map') : $t('hide_map')"
        @click="toggleMap()"
      >
        <MapIcon class="size-6" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style>
.rotated {
  transform: rotate(180deg);
}
.regulations > div:nth-child(2).show {
  max-height: 1000px;
  transition: max-height 0.5s ease-in-out;
}
.regulations > div:nth-child(2) {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}
</style>
