<script>
export default {
  props: {
    items: Array,
  },
}
</script>

<template>
  <DynamicScroller :items="items" :min-item-size="54" class="scroller">
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.message]"
        :data-index="index"
      >
        <div class="avatar">
          <img :key="item.avatar" :src="item.avatar" alt="avatar" class="image">
        </div>
        <div class="text">{{ item.message }}</div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>

  <DynamicScroller
    v-if="filteredCities.length"
    :items="filteredCities"
    :min-item-size="100"
    key-field="id"
    page-mode
  >
    <template #default="{ item, active }">
      <DynamicScrollerItem
        :size-dependencies="[item.name]"
        :item="item"
        :active="active"
        :class="filterStore.selectedCity ? 'opacity-25 saturate-50' : ''"
        class="group flex origin-left cursor-pointer flex-col justify-between gap-x-6 border-b transition-all duration-500 ease-out hover:brightness-105 hover:drop-shadow-xl sm:flex-row md:items-center"
        @click="showCity(item)"
      >
        <div
          class="flex w-full justify-between px-2 py-6 pb-1 sm:flex-col sm:justify-start sm:pb-4 lg:px-3"
        >
          <div class="flex w-max items-center">
            <i :class="item.country.iso" class="flat flag huge shrink-0" />
            <div class="ml-3 flex flex-col justify-start">
              <p
                class="mr-2 origin-left break-all rounded-full font-bold transition-all duration-500 ease-out group-hover:text-gray-500"
              >
                {{ item.name }}
              </p>
              <p class="break-all text-xs font-semibold text-blumilk-500">
                {{ item.country.name }}
              </p>
            </div>
          </div>
          <div
            class="mt-0 flex w-fit items-center justify-end sm:ml-[64px] sm:mt-1 sm:justify-start"
          >
            <div class="hover:drop-shadow">
              <FavoriteButton
                v-if="isAuth"
                class="flex rounded-full py-0.5 hover:drop-shadow"
                :cityid="item.id"
              />
              <InfoPopup v-else class="flex rounded-full py-0.5 hover:drop-shadow" />
            </div>
            <div
              class="ml-2 flex rounded-full py-0.5 text-blumilk-500 hover:drop-shadow"
              @click.stop="goToCityPage(item)"
            >
              <InformationCircleIcon class="size-8 hover:drop-shadow sm:size-6" />
            </div>
          </div>
        </div>
        <ProviderIcons :item="item" :providers="props.providers" />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<style scoped>
.scroller {
  height: 100%;
}
</style>
