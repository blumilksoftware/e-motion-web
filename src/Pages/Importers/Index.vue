<script setup lang="ts">
import Import from '@/components/Import.vue'
import PaginationInfo from '@/components/PaginationInfo.vue'
import Pagination from '@/components/Pagination.vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import { apiUrl } from '@/main'
import { ref } from 'vue'
import { i18n } from '@/main'
const $t = i18n.global.t

const importInfo = ref([])
const codes = ref([])
const providers = ref([])

axios
  .get(`${apiUrl}/api/admin/importers`)
  .then((response) => {
    importInfo.value = response.data.importInfo
    codes.value = response.data.codes
    providers.value = response.data.providers
  })
  .catch((error) => {
    console.error(error)
  })

function runImporters() {
  axios.post(`${apiUrl}/api/run-importers`)
  toast.success($t('Importers started.'))
}

function runRules() {
  axios.get(`${apiUrl}/api/import-rules/0`)
  toast.success($t('Rules import started.'))
}
</script>

<template>
  <div class="flex w-full md:justify-end">
    <div class="mt-16 flex size-full flex-col justify-between md:mt-0 w-full">
      <div class="m-4 flex flex-col lg:mx-8">
        <div class="m-4">
          <button
            class="my-5 mr-10 w-fit rounded bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-400 md:py-2"
            @click="runImporters"
          >
            {{ $t('Run importers') }}
          </button>
          <button
            class="my-5 w-fit rounded bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-400 md:py-2"
            @click="runRules"
          >
            {{ $t('Run rules import') }}
          </button>
        </div>

        <!-- <PaginationInfo v-if="importInfo.length" :meta="importInfo.meta" /> -->
        <div v-if="importInfo.length" class="rounded-lg ring-gray-300 sm:ring-1">
          <table class="min-w-full">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="table-cell py-3.5 pl-2 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-5"
                >
                  {{ $t('Who') }}
                </th>
                <th
                  scope="col"
                  class="table-cell p-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {{ $t('When') }}
                </th>
                <th
                  scope="col"
                  class="table-cell py-3.5 pl-1 text-left text-sm font-semibold text-gray-900"
                >
                  {{ $t('Status') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <Import
                v-for="info in importInfo"
                :key="info.id"
                :info="info"
                :codes="codes"
                :providers="providers"
              />
            </tbody>
          </table>
        </div>
        <p v-else class="mt-6 flex text-lg font-medium text-gray-500">
          {{ $t(`Didn't find anything. Just empty space.`) }}
        </p>

        <!-- <Pagination :meta="importInfo.meta" :links="importInfo.links" /> -->
      </div>
    </div>
  </div>
</template>
