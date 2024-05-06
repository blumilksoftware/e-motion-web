<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue3-toastify'
import { HeartIcon as SolidHeartIcon } from '@heroicons/vue/24/solid'
import { HeartIcon as OutlineHeartIcon } from '@heroicons/vue/24/outline'
import { i18n } from '@/main'
import { apiUrl } from '@/main'
import { isAutoAccessorPropertyDeclaration } from 'typescript'
const $t = i18n.global.t

const props = defineProps({
  cityid: {
    type: Number,
    required: true,
  },
  isFavoriteCitiesPage: Boolean,
  growUp: Boolean,
})

const result = ref(null)
const url = `${apiUrl}/api/favorites/${props.cityid}`
const intersectionTarget = ref(null)

const fetchData = async () => {
  try {
    const response = await axios.get(url)
    result.value = response.data
  } catch (error) {
    toast.error($t('fetching_error'))
  }
}

const toggleFavorite = async () => {
  try {
    if (result.value === null) {
      await fetchData()
    }

    await axios.post(`${apiUrl}/api/favorites`, {
      city_id: props.cityid,
    }, {
      preserveScroll: true,
    })
    result.value = !result.value

    if (result.value === false) {
      toast.info($t('City removed from favorites.'))
    } else if (result.value === true) {
      toast.success($t('City added to favorites.'))
    }
  } catch (error) {
    toast.error($t('There was an error'))
  }
}

const onIntersection = async (entries) => {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      await fetchData()
    }
  })
}

onMounted(() => {
  if (intersectionTarget.value && !props.isFavoriteCitiesPage) {
    const observer = new IntersectionObserver(onIntersection, {
      root: null,
      threshold: 0.5,
    })
    observer.observe(intersectionTarget.value)
  } else {
    result.value = true
  }
})
</script>

<template>
  <div ref="intersectionTarget">
    <button @click.stop="toggleFavorite">
      <component :is="result ? SolidHeartIcon : OutlineHeartIcon" v-if="result !== null"
                 class="text-rose-500"
                 :class="growUp ? 'h-10 w-10 sm:h-9 sm:w-9' : 'h-8 w-8 sm:h-6 sm:w-6'"
      />
      <span v-else class="animate-pulse text-rose-200">
        <SolidHeartIcon
          :class="growUp ? 'h-10 w-10 sm:h-9 sm:w-9' : 'h-8 w-8 sm:h-6 sm:w-6'"
        />
      </span>
    </button>
  </div>
</template>
