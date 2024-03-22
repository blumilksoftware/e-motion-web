<script setup lang="ts">
import { ref } from "vue";
import LangSwitch from "@/components/LangSwitch.vue"; // @ is an alias to /src

const isMenuOpen = ref(false);
const isAdmin = ref(true);
const isAuth = ref(false);
const countCitiesWithoutAssignedCountry = ref(1);
const countCitiesWithoutCoordinates = ref(1);
function logout() {
  console.log("logout");
}
function toggleAuthDialog() {
  console.log("toggleAuthDialog");
}
//  TODO: scripts
</script>

<template>
  <nav
    class="w-full z-30 h-16 px-6 py-3 bg-white justify-between items-center flex"
  >
    <router-link to="/" class="flex items-center space-x-2 text-2xl font-bold"
      ><img src="@/assets/logo.png" class="h-10 inline-block float-start" />
      <span>e-motion</span>
    </router-link>
    <div class="flex md:hidden">
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="block h-6 w-6"
          :class="{ hidden: isMenuOpen, block: !isMenuOpen }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
        <svg
          class="hidden h-6 w-6"
          :class="{ block: isMenuOpen, hidden: !isMenuOpen }"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <div class="hidden items-center md:flex md:gap-x-12">
      <div
        v-if="
          countCitiesWithoutAssignedCountry || countCitiesWithoutCoordinates
        "
        class="flex items-center text-xs font-bold text-rose-500"
      >
        <router-link
          v-if="countCitiesWithoutAssignedCountry"
          to="/admin/cities"
          class="flex animate-pulse items-center rounded-full border border-rose-500 bg-rose-50 px-2 py-1"
        >
          [flag]{{ countCitiesWithoutAssignedCountry }}
        </router-link>
        <router-link
          v-if="countCitiesWithoutCoordinates"
          to="/admin/cities"
          class="ml-2 flex animate-pulse items-center rounded-full border border-rose-500 bg-rose-50 px-2 py-1"
        >
          [map]{{ countCitiesWithoutCoordinates }}
        </router-link>
      </div>
      <router-link v-if="isAdmin" to="/admin/cities" class="font-bold"
        >[desktop]</router-link
      >
      <button>
        <img
          v-if="isAuth"
          src="favicon.ico"
          alt=""
          class="h-6 w-6"
          @click="logout"
        />
        <img
          v-else
          src="favicon.ico"
          alt=""
          class="h-6 w-6 invert"
          @click="toggleAuthDialog"
        />
      </button>
      <lang-switch />
    </div>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  // outline: green dashed 1px;
}

nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    // &.router-link-exact-active {
    //   color: #42b983;
    // }
  }
}
</style>
