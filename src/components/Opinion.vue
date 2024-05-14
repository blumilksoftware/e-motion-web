<script setup>
import {
  PaperAirplaneIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { useForm, usePage } from '@inertiajs/vue3'
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import DeleteModal from './DeleteModal.vue'
// import toast from 'vue-toastification'
import ErrorMessage from './ErrorMessage.vue'
import { toast } from 'vue3-toastify'
import store from '@/store/SessionData'
import { apiUrl } from '@/main'
import axios from 'axios'
import { i18n } from '@/main'
const $t = i18n.global.t
const isAdmin = computed(() => store.state.auth.isAdmin)
const user = computed(() => store.state.auth.userID)
const props = defineProps({
  opinion: Object,
  cityId: Number
})

const updateOpinionForm = useForm({
  rating: props.opinion.rating,
  content: props.opinion.content,
  city_id: props.cityId
})
function updateOpinion(opinionId) {
  if (updateOpinionForm.rating === 0) {
    emptyRatingError.value = $t('no_rating_error')
  } else {
    axios
      .patch(`${apiUrl}/opinions/${opinionId}`, updateOpinionForm.data)
      .then(() => {
        toast.success($t('update_opinion_success'))
        isUpdateOpinionDialogOpened.value = false
      })
      .catch(() => {
        toast.error($t('update_opinion_error'))
      })
  }
}

const isUpdateOpinionDialogOpened = ref(false)

const updateOpinionDialog = ref(null)
onClickOutside(updateOpinionDialog, () => (isUpdateOpinionDialogOpened.value = false))

function toggleUpdateOpinionDialog() {
  isUpdateOpinionDialogOpened.value = !isUpdateOpinionDialogOpened.value
}

function deleteOpinion(opinionId) {
  axios
    .delete(`${apiUrl}/opinions/${opinionId}`)
    .then(() => {
      toast.success($t('delete_opinion_success'))
      isDeleteOpinionDialogOpened.value = false
    })
    .catch(() => {
      toast.error($t('delete_opinion_error'))
    })
}

const isDeleteOpinionDialogOpened = ref(false)

function toggleDeleteOpinionDialog() {
  isDeleteOpinionDialogOpened.value = !isDeleteOpinionDialogOpened.value
}

const dateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}

const maxRating = 5

function setRating(starIndex) {
  updateOpinionForm.rating = starIndex
}

const emptyRatingError = ref('')
</script>

<template>
  <div class="flex items-center">
    <p class="mr-1 text-xs font-medium text-blue-500">
      {{ opinion.user.name }}
    </p>
    <StarIcon
      v-for="index in maxRating"
      :key="index"
      :class="{ 'fill-yellow-400': index <= props.opinion.rating }"
      class="size-4 text-yellow-400"
    />
  </div>
  <p class="mr-1 text-xs font-light text-blue-500">
    {{ new Date(opinion.updated_at).toLocaleString('pl-PL', dateOptions) }}
  </p>

  <div class="mt-1 text-sm text-gray-700">
    {{ opinion.content }}
  </div>

  <div v-if="user === props.opinion.user.id || isAdmin" class="mt-1 flex justify-end">
    <button
      v-if="user === props.opinion.user.id"
      class="flex px-1 hover:drop-shadow"
      @click="toggleUpdateOpinionDialog"
    >
      <PencilIcon class="size-5 text-gray-500 hover:drop-shadow sm:size-4" />
    </button>
    <button class="flex px-1 hover:drop-shadow" @click="toggleDeleteOpinionDialog">
      <TrashIcon class="ml-1 size-5 text-red-500 hover:drop-shadow sm:size-4" />
    </button>
  </div>

  <div
    v-if="isUpdateOpinionDialogOpened"
    class="absolute inset-0 z-100 flex items-center bg-black/50"
  >
    <div ref="updateOpinionDialog" class="mx-auto w-11/12 rounded-lg bg-white shadow-lg">
      <div class="flex flex-col">
        <div class="flex justify-end">
          <button class="w-fit px-4 pt-4" @click.stop="toggleUpdateOpinionDialog">
            <XMarkIcon class="size-6" />
          </button>
        </div>

        <form class="flex flex-col px-5 pb-4" @submit.prevent="updateOpinion(opinion.id)">
          <p class="mb-2 text-xs font-medium text-gray-700">
            {{ $t('edit_opinion') }}
          </p>
          <div class="mb-2 flex items-center space-x-1">
            <StarIcon
              v-for="index in maxRating"
              :key="index"
              class="size-6 cursor-pointer text-yellow-400"
              :class="{ 'fill-yellow-400': index <= updateOpinionForm.rating }"
              @click="setRating(index)"
            />
          </div>
          <textarea
            v-model.trim="updateOpinionForm.content"
            required
            class="h-32 w-full rounded-lg border border-gray-300"
            @keydown.enter.prevent="updateOpinion(opinion.id)"
          />

          <div class="mt-1 flex flex-col" />

          <button
            :disabled="!updateOpinionForm.isDirty"
            :class="
              updateOpinionForm.isDirty
                ? 'bg-emerald-500 hover:bg-emerald-600 '
                : 'bg-gray-400 hover:bg-gray-500'
            "
            class="mt-2 flex w-full items-center justify-center rounded-lg p-3 text-xs font-medium text-white sm:w-fit sm:px-4 sm:py-2"
          >
            {{ $t('send') }}
            <PaperAirplaneIcon class="ml-2 size-4" />
          </button>
        </form>
      </div>
    </div>
  </div>

  <DeleteModal
    v-if="isDeleteOpinionDialogOpened"
    :name="''"
    :type="'That opinion'"
    @close="toggleDeleteOpinionDialog"
    @delete="deleteOpinion(opinion.id)"
  />
</template>
