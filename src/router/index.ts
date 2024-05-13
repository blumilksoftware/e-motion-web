import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminCitiesView from '@/views/AdminCitiesView.vue'
import AdminCountriesView from '@/views/AdminCountriesView.vue'
import NavAdminPanel from '@/layouts/NavAdminPanel.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/Pages/Landing/Index.vue')
    // component: HomeView
  },
  {
    path: '/admin',
    component: NavAdminPanel,
    children: [
      {
        path: 'cities',
        component: () => import('@/Pages/Cities/Index.vue')
      },
      {
        path: 'countries',
        component: () => import('@/Pages/Countries/Index.vue')
      },
      {
        path: '',
        redirect: 'cities'
      },
      {
        path: 'importers',
        component: () => import('@/Pages/Importers/Index.vue')
      },
      {
        path: 'dashboard',
        component: () => import('@/Pages/Dashboard/Index.vue')
      }
    ]
  },
  {
    path: '/city/:country/:city',
    component: () => import('@/Pages/City/Index.vue'),
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'home' }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/Pages/FavoriteCities/Index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
