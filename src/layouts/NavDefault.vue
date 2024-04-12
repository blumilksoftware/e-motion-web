<script setup lang="ts">
import { ref } from 'vue'
import LangSwitch from '@/components/LangSwitch.vue' // @ is an alias to /src
import ErrorMessage from '@/components/ErrorMessage.vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { useForm } from '@inertiajs/vue3'

import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ComputerDesktopIcon,
  ArrowRightStartOnRectangleIcon,
  MapPinIcon,
  FlagIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'
const isMobileMenuOpened = ref(false)
const isAuthDialogOpened = ref(false)
const isLoginFormSelected = ref(true)
const isPasswordVisible = ref(false)
const isAdmin = ref(true)
const isAuth = ref(true)
const countCitiesWithoutAssignedCountry = ref(1)
const countCitiesWithoutCoordinates = ref(1)

//  TODO: scripts

/**
 * You can specify the your definition schema with object literal at first type parameters
 * About type parameter, see the http://vue-i18n.intlify.dev/api/composition.html#usei18n
 */
// Placeholder functions
const login = () => {
  console.log('login')
}
const register = () => {
  console.log('register')
}
const socialMediaLogin = (provider: string) => {
  console.log('socialMediaLogin', provider)
}
const togglePasswordVisibility = () => {
  console.log('togglePasswordVisibility')
}
const toggleAuthOption = () => {
  console.log('toggleAuthOption')
}
const toggleAuthDialog = () => {
  console.log('toggleAuthDialog')
}
const toggleMobileMenu = () => {
  isMobileMenuOpened.value = !isMobileMenuOpened.value
}
const logout = () => {
  console.log('logout')
}

const loginForm = ref({
  email: '',
  password: '',
  processing: false,
  errors: {
    loginError: ''
  }
})
const registerForm = useForm({
  name: '',
  email: '',
  password: ''
})
const navigation = [
  {
    name: 'Home',
    to: '/'
  },
  {
    name: 'About',
    to: '/about'
  }
]
</script>

<template>
  <nav class="w-full z-30 h-16 px-6 py-3 bg-white justify-between items-center flex">
    <router-link to="/" class="flex items-center space-x-2 text-2xl font-bold">
      <img src="/logo.svg" class="h-10 inline-block float-start" />
    </router-link>
    <div class="flex md:hidden">
      <button
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        @click="isMobileMenuOpened = !isMobileMenuOpened"
      >
        <span class="sr-only">Open main menu</span>
        <bars3-icon
          class="size-6"
          :class="{ hidden: isMobileMenuOpened, block: !isMobileMenuOpened }"
        />
        <x-mark-icon
          class="size-6"
          :class="{ hidden: !isMobileMenuOpened, block: isMobileMenuOpened }"
        />
      </button>
    </div>
    <div class="hidden items-center md:flex md:gap-x-12">
      <div
        v-if="countCitiesWithoutAssignedCountry || countCitiesWithoutCoordinates"
        class="flex items-center text-xs font-bold text-rose-500"
      >
        <router-link
          v-if="countCitiesWithoutAssignedCountry"
          to="/admin/cities"
          class="flex animate-pulse items-center rounded-full border border-rose-500 bg-rose-50 px-2 py-1"
        >
          <flag-icon class="size-4" />
          {{ countCitiesWithoutAssignedCountry }}
        </router-link>
        <router-link
          v-if="countCitiesWithoutCoordinates"
          to="/admin/cities"
          class="ml-2 flex animate-pulse items-center rounded-full border border-rose-500 bg-rose-50 px-2 py-1"
        >
          <map-pin-icon class="size-4" />
          {{ countCitiesWithoutCoordinates }}
        </router-link>
      </div>
      <router-link v-if="isAdmin" to="/admin/cities" class="font-bold">
        <computer-desktop-icon class="size-8" />
      </router-link>
      <button>
        <arrow-right-start-on-rectangle-icon v-if="isAuth" class="size-8" @click="logout" />
        <user-circle-icon v-else class="size-8" @click="toggleAuthDialog" />
      </button>
      <lang-switch />
    </div>
  </nav>
  <div v-if="isAuthDialogOpened" class="fixed inset-0 z-50 flex items-center bg-black/50">
    <div
      ref="authDialog"
      class="mx-auto w-11/12 rounded-lg bg-white shadow-lg sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
    >
      <div class="flex w-full justify-end">
        <button class="p-4" @click="toggleAuthDialog">
          <XMarkIcon class="size-6" />
        </button>
      </div>
      <div v-if="isLoginFormSelected" class="rounded-lg px-6 pb-8">
        <form class="space-y-5" @submit.prevent="login">
          <div>
            <label class="mb-1 block text-sm font-semibold text-gray-800">{{ $t('Email') }}</label>
            <input
              v-model="loginForm.email"
              type="email"
              class="w-full rounded-lg border-blumilk-200 py-3 md:p-2"
              required
            />
          </div>
          <div class="relative">
            <label class="mb-1 block w-full text-sm font-semibold text-gray-800">{{
              $t('Password')
            }}</label>
            <input
              v-model="loginForm.password"
              :type="isPasswordVisible ? 'text' : 'password'"
              class="w-full rounded-lg border-blumilk-200 py-3 md:p-2"
              required
            />
            <button
              type="button"
              class="absolute bottom-3 right-2 md:bottom-2"
              @click="togglePasswordVisibility"
            >
              <component
                :is="!isPasswordVisible ? EyeIcon : EyeSlashIcon"
                class="size-6 text-blumilk-400"
              />
            </button>
          </div>
          <ErrorMessage :message="loginForm.errors.loginError" />
          <div>
            <label class="mb-4 flex justify-center text-sm font-semibold text-gray-800">{{
              $t('You can also login by:')
            }}</label>
            <div class="flex items-center justify-center space-x-5">
              <button
                type="button"
                class="flex items-center justify-center"
                @click="socialMediaLogin('github')"
              >
                <img class="size-10" src="@/assets/logo.png" alt="github logo" />
              </button>
              <button
                type="button"
                class="flex items-center justify-center"
                @click="socialMediaLogin('facebook')"
              >
                <img class="size-10" src="@/assets/logo.png" alt="facebook logo" />
              </button>
              <button
                type="button"
                class="flex items-center justify-center"
                @click="socialMediaLogin('google')"
              >
                <img class="size-10" src="@/assets/logo.png" alt="google logo" />
              </button>
            </div>
          </div>
          <div class="flex w-full md:w-fit">
            <button
              type="submit"
              class="w-full rounded-lg bg-blumilk-500 p-4 font-semibold text-white hover:bg-blumilk-600 md:py-2"
            >
              {{ $t('Log in') }}
            </button>
          </div>
        </form>
        <button
          :disabled="loginForm.processing"
          class="mt-6 text-xs font-light"
          @click="toggleAuthOption"
        >
          {{ $t('Don`t have an account?') }}
          <span class="font-normal">{{ $t('Sign up') }}</span>
        </button>
      </div>

      <div v-else class="rounded-lg px-6 pb-8">
        <form class="space-y-5" @submit.prevent="register">
          <div>
            <label class="mb-1 block text-sm font-semibold text-gray-800">{{ $t('Name') }}</label>
            <input
              v-model="registerForm.name"
              type="text"
              class="w-full rounded-lg border-blumilk-200 py-3 md:p-2"
              required
            />
            <ErrorMessage :message="registerForm.errors.name" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-semibold text-gray-800">{{ $t('Email') }}</label>
            <input
              v-model="registerForm.email"
              type="email"
              class="w-full rounded-lg border-blumilk-200 py-3 md:p-2"
              required
            />
            <ErrorMessage :message="registerForm.errors.email" />
          </div>
          <div class="relative">
            <label class="mb-1 block text-sm font-semibold text-gray-800">{{
              $t('Password')
            }}</label>
            <input
              v-model="registerForm.password"
              :type="isPasswordVisible ? 'text' : 'password'"
              class="w-full rounded-lg border-blumilk-200 py-3 md:p-2"
              required
            />
            <button
              type="button"
              class="absolute bottom-3 right-2 md:bottom-2"
              @click="togglePasswordVisibility"
            >
              <component
                :is="!isPasswordVisible ? EyeIcon : EyeSlashIcon"
                class="size-6 text-blumilk-400"
              />
            </button>
          </div>
          <ErrorMessage :message="registerForm.errors.password" />
          <div class="flex w-full md:w-fit">
            <button
              type="submit"
              class="w-full rounded-lg bg-blumilk-500 p-4 font-semibold text-white hover:bg-blumilk-600 md:py-2"
            >
              {{ $t('Sign up') }}
            </button>
          </div>
        </form>
        <button
          :disabled="registerForm.processing"
          class="mt-6 text-xs font-light"
          @click="toggleAuthOption"
        >
          {{ $t('Already have an account?') }}
          <span class="font-normal">{{ $t('Log in') }}</span>
        </button>
      </div>
    </div>
  </div>
  <Dialog
    v-if="isMobileMenuOpened"
    as="div"
    class="z-30 lg:hidden"
    :open="isMobileMenuOpened"
    @close="toggleMobileMenu"
  >
    <div class="fixed inset-0 z-30" />
    <DialogPanel
      class="fixed inset-y-0 right-0 z-30 w-full overflow-y-auto border-b-2 bg-white px-6 py-3 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
    >
      <div class="flex items-center justify-between sm:justify-end">
        <router-link to="/">
          <img class="h-10 sm:hidden" src="@/assets/logo.png" alt="escooter logo" />
        </router-link>
        <button
          type="button"
          class="-m-2.5 rounded-md px-2.5 text-gray-700 sm:pt-4"
          @click="toggleMobileMenu"
        >
          <span class="sr-only">{{ $t('Close_menu') }}</span>
          <XMarkIcon class="size-6" aria-hidden="true" />
        </button>
      </div>
      <div class="mt-6 flow-root">
        <div class="-my-6 divide-y divide-gray-500/10">
          <div class="space-y-4 pt-6">
            <div class="space-y-2 py-6">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-800 hover:bg-blumilk-25"
              >
                {{ $t(item.name) }}
              </router-link>
            </div>

            <div
              v-if="countCitiesWithoutAssignedCountry || countCitiesWithoutCoordinates"
              class="flex flex-col items-start text-sm font-bold text-rose-500"
            >
              <router-link
                v-if="countCitiesWithoutAssignedCountry"
                to="/admin/cities"
                class="flex items-center"
              >
                <FlagIcon class="mr-2 size-5 shrink-0" />
                {{ $t('Cities_no_country') }}:
                {{ countCitiesWithoutAssignedCountry }}
              </router-link>
              <router-link
                v-if="countCitiesWithoutCoordinates"
                to="/admin/cities?order=empty-coordinates"
                class="mt-5 flex items-center"
              >
                <MapPinIcon class="mr-2 size-5 shrink-0" />
                {{ $t('Cities_no_coordinates') }}:
                {{ countCitiesWithoutCoordinates }}
              </router-link>
            </div>

            <div class="pb-6">
              <button v-if="isAdmin" class="-mx-3 mb-4 flex w-full font-semibold text-gray-800">
                <router-link
                  v-if="isAdmin"
                  class="flex w-full items-center rounded px-3 py-2.5 hover:bg-blumilk-25"
                  to="/admin/cities"
                >
                  <ComputerDesktopIcon class="size-6" />
                  <span class="ml-2">{{ $t('Admin_panel') }}</span>
                </router-link>
              </button>
              <button class="-mx-3 flex w-full font-semibold text-gray-800">
                <span
                  v-if="isAuth"
                  class="flex w-full items-center rounded px-3 py-2.5 hover:bg-blumilk-25"
                  @click="logout"
                >
                  <ArrowRightStartOnRectangleIcon class="size-6" />
                  <span class="ml-2">{{ $t('Log out') }}</span>
                </span>

                <span
                  v-if="!isAuth"
                  class="flex w-full items-center rounded px-3 py-2.5 hover:bg-blumilk-25"
                  @click="toggleAuthDialog"
                >
                  <UserCircleIcon class="size-6" />
                  <span class="ml-2">{{ $t('Log in') }}</span>
                </span>
              </button>
              <div class="mx-auto flex items-center pt-8">
                <LangSwitch class="text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogPanel>
  </Dialog>
  <div class="w-full h-[calc(100vh-64px)] overflow-hidden relative">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
