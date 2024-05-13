<script setup lang="ts">
import Import from '@/components/Import.vue'
import { toast } from 'vue3-toastify'
import axios from 'axios'
import { apiUrl } from '@/main'
import { ref } from 'vue'
import { i18n } from '@/main'
import router from '@/router'
if (!store.state.auth.isAdmin) {
  router.push('/')
}
const $t = i18n.global.t

const importInfo = ref<ImportInfo[]>([])

interface ImportInfo {
  id: number
  who_runs_it: string | null
  status: string
  created_at: string | null
  updated_at: string | null
  import_info_details: Object | null
}
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
  toast.success($t('importers_started'))
}

function runRules() {
  axios.get(`${apiUrl}/api/import-rules`)
  toast.success($t('rules_import_started'))
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
            {{ $t('run_import') }}
          </button>
          <button
            class="my-5 w-fit rounded bg-blue-500 px-5 py-3 text-sm font-medium text-white shadow-md hover:bg-blue-400 md:py-2"
            @click="runRules"
          >
            {{ $t('run_rules_import') }}
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
                  {{ $t('who') }}
                </th>
                <th
                  scope="col"
                  class="table-cell p-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {{ $t('when') }}
                </th>
                <th
                  scope="col"
                  class="table-cell py-3.5 pl-1 text-left text-sm font-semibold text-gray-900"
                >
                  {{ $t('status') }}
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
          {{ $t(`did_not_find_anything`) }}
        </p>

        <!-- <Pagination :meta="importInfo.meta" :links="importInfo.links" /> -->
      </div>
    </div>
  </div>
</template>
