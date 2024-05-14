<script setup>
import { onMounted, ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto'
import { Doughnut } from 'vue-chartjs'
import { apiUrl, i18n } from '@/main'
import axios from 'axios'
import store from '@/store/SessionData'
import router from '@/router'
if (!store.state.auth.isAdmin) {
  router.push('/')
}
const $t = i18n.global.t

onMounted(() => {
  ChartJS.register(ArcElement, Tooltip, Legend)
})
const dataIsFetched = ref(false)
const usersCount = ref(0)
const citiesWithProvidersCount = ref(0)
const countriesWithCitiesWithProvidersCount = ref(0)
const providersCount = ref(0)
const providerCitiesCount = ref([{}])
const providers = ref([{}])

axios
  .get(`${apiUrl}/api/admin/dashboard`)
  .then((response) => {
    usersCount.value = response.data.usersCount
    citiesWithProvidersCount.value = response.data.citiesWithProvidersCount
    countriesWithCitiesWithProvidersCount.value =
      response.data.countriesWithCitiesWithProvidersCount
    providersCount.value = response.data.providersCount
    providerCitiesCount.value = response.data.providerCitiesCount
    providers.value = response.data.providers
    const labels = []
    const backgroundColors = []
    const data = []

    providerCitiesCount.value.forEach((provider) => {
      labels.push(provider.name)
      backgroundColors.push(getProviderColor(provider.name))
      data.push(provider.count)
    })
    chartData.value = {
      labels: labels,
      datasets: [
        {
          backgroundColor: backgroundColors,
          data: data,
        },
      ],
    }
    dataIsFetched.value = true
    return
  })
  .catch((error) => {
    console.error(error)
  })

function getProviderColor(providerName) {
  const provider = providers.value.find((provider) => provider.name === providerName)

  return provider ? provider.color : ''
}

const chartData = ref({
  labels: [3],
  datasets: [
    {
      backgroundColor: [],
      data: [5],
    },
  ],
})

onMounted(() => {
  const labels = []
  const backgroundColors = []
  const data = []

  providerCitiesCount.value.forEach((provider) => {
    labels.push(provider.name)
    backgroundColors.push(getProviderColor(provider.name))
    data.push(provider.count)
  })

  chartData.value = {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: data,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2 / 3,
  animation: false,
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<template>
  <div v-if="dataIsFetched" class="flex relative min-h-screen flex-col md:flex-row">
    <div class="flex md:justify-end">
      <div class="flex size-auto flex-col">
        <div class="p-4">
          <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div class="overflow-hidden rounded-lg border bg-white px-4 py-5 sm:p-6">
              <dt class="truncate text-sm font-medium text-blue-500">
                {{ $t('no_users') }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {{ usersCount }}
              </dd>
            </div>
            <div class="overflow-hidden rounded-lg border bg-white px-4 py-5 sm:p-6">
              <dt class="truncate text-sm font-medium text-blue-500">
                {{ $t('cities_providers') }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {{ citiesWithProvidersCount }}
              </dd>
            </div>
            <div class="overflow-hidden rounded-lg border bg-white px-4 py-5 sm:p-6">
              <dt class="truncate text-sm font-medium text-blue-500">
                {{ $t('countries_providers') }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {{ countriesWithCitiesWithProvidersCount }}
              </dd>
            </div>
            <div class="overflow-hidden rounded-lg border bg-white px-4 py-5 sm:p-6">
              <dt class="truncate text-sm font-medium text-blue-500">
                {{ $t('no_providers') }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {{ providersCount }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="flex w-full flex-col lg:mt-6 lg:flex-row lg:justify-end">
          <div class="w-full px-3 lg:w-1/2">
            <h1 class="mx-2 mb-2 text-2xl font-bold text-gray-700">
              {{ $t('no_cities_with_providers') }}
            </h1>

            <div class="flex flex-wrap">
              <div
                v-for="provider in providerCitiesCount"
                :key="provider.name"
                class="m-2 flex flex-col items-center shadow-lg"
              >
                <div
                  :style="{ 'background-color': getProviderColor(provider.name) }"
                  class="flex h-12 w-16 shrink-0 items-center justify-center rounded-md rounded-b-none p-6 px-2 py-3"
                >
                  <img
                    loading="lazy"
                    :src="provider.name ? '/providers/' + provider.name.toLowerCase() + '.png' : ''"
                    alt=""
                  >
                </div>
                <div class="w-full rounded rounded-t-none border border-t-0 bg-gray-50">
                  <span
                    class="flex w-full justify-center rounded-full text-sm font-medium text-gray-700"
                  >{{ provider.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 px-6 pb-6 lg:mt-0 lg:w-1/2">
            <Doughnut :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
