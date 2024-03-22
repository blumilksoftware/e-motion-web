<template>
  <div class="home">
    <div class="h-[calc(100%-64px)] w-full lg:w-1/2 absolute left-0">main</div>
    <div class="h-[calc(100%-64px)] w-full lg:w-1/2 absolute right-0">map</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {}
</script>
