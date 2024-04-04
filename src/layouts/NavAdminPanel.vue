<script setup>
import { ClipboardIcon, FlagIcon, MapPinIcon, PlayCircleIcon } from '@heroicons/vue/24/solid'

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard', icon: ClipboardIcon },
  { name: 'Importers', to: '/admin/importers', icon: PlayCircleIcon },
  { name: 'Countries', to: '/admin/countries', icon: FlagIcon },
  { name: 'Cities', to: '/admin/cities', icon: MapPinIcon },
]

</script>

<template>
  <div
    class="fixed z-10 flex w-full border-blumilk-50 bg-blumilk-25 shadow md:h-full md:w-1/3 md:border-r lg:w-1/4 xl:w-1/6"
  >
    <div class="flex w-full justify-between md:flex-col md:justify-normal">
      <div class="mr-3.5 w-full sm:hidden h-16">
        <div class="flex justify-evenly h-16">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="flex h-full md:h-fit"
          >
            <div
              :class="{
                'bg-blue-50 border-b-2 border-blue-700': $route.path.startsWith(item.to)
              }"
              class="mx-auto flex w-11/12 items-center bg-blumilk-25 px-6 hover:bg-blumilk-50 md:rounded-lg md:px-2 md:py-3"
            >
              <component :is="item.icon" class="size-7" />
            </div>
          </router-link>
        </div>
      </div>

      <ul
        class="hidden h-full items-center text-sm font-medium text-gray-800 sm:flex md:mt-12 md:flex-col md:items-stretch md:space-y-2"
      >
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="flex h-full md:h-fit"
        >
          <div
            :class="{ 'bg-blumilk-50': $route.path.startsWith(item.to) }"
            class="mx-auto flex w-11/12 items-center bg-blumilk-25 px-6 hover:bg-blumilk-50 md:rounded-lg md:px-2 md:py-3"
          >
            <component :is="item.icon" class="size-7" />
            <span class="ml-3 hidden md:flex"> {{ $t(item.name) }} </span>
          </div>
        </router-link>
        <li class="flex px-5 md:pt-6" />
      </ul>
    </div>
  </div>
  <div class="w-full absolute bottom-0 right-0 h-[calc(100%-128px)] md:w-2/3 lg:w-3/4 xl:w-5/6 sm:h-[calc(100%-64px)]">
    <router-view class="size-full" />
  </div>
</template>
