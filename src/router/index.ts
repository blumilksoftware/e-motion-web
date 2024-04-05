import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminCitiesView from '@/views/AdminCitiesView.vue'
import AdminCountriesView from '@/views/AdminCountriesView.vue'
import NavAdminPanel from '@/layouts/NavAdminPanel.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin',
    component: NavAdminPanel,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'cities',
        component: AdminCitiesView
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
