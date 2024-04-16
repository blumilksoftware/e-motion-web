import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminCitiesView from '@/views/AdminCitiesView.vue'
import AdminCountriesView from '@/views/AdminCountriesView.vue'
import NavAdminPanel from '@/layouts/NavAdminPanel.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   component: HomeView,
  //   children: [
  //     {
  //       path: '',
  //       name: 'home',
  //       component: () => import('@/Pages/Landing/Index.vue')
  //     },
  //     {
  //       path: ':country/:city',
  //       component: () => import('@/Pages/City/Index.vue')
  //     }
  //   ]
  // },
  {
    path: '/',
    name: 'home',
    // component: () => import('@/Pages/Landing/Index.vue')
    component: HomeView
  },
  {
    path: '/admin',
    component: NavAdminPanel,
    children: [
      {
        path: 'cities',
        component: AdminCitiesView
      },
      {
        path: 'countries',
        component: AdminCountriesView
      },
      {
        path: '',
        redirect: 'cities'
      },
      {
        path: 'importers',
        component: () => import('@/views/AdminImportersView.vue')
      },
      {
        path: 'dashboard',
        component: () => import('@/views/AdminDashboardView.vue')
      }
    ]
  },
  {
    path: '/city?country=:country&city=:city',
    component: () => import('@/Pages/City/Index.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
