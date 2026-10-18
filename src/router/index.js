import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'overview', component: () => import('../views/OverviewView.vue') },
    { path: '/denah', name: 'floorplan', component: () => import('../views/FloorPlanView.vue') },
    { path: '/kolam', name: 'pond', component: () => import('../views/PondView.vue') },
    { path: '/hidroponik', redirect: '/kontrol' },
    { path: '/iklim', name: 'climate', component: () => import('../views/ClimateView.vue') },
    { path: '/energi', name: 'energy', component: () => import('../views/EnergyView.vue') },
    { path: '/kontrol', name: 'control', component: () => import('../views/ControlView.vue') },
    { path: '/alert', name: 'alerts', component: () => import('../views/AlertsView.vue') },
    { path: '/laporan', name: 'reports', component: () => import('../views/ReportsView.vue') },
    { path: '/pengaturan', name: 'settings', component: () => import('../views/SettingsView.vue') },
  ],
})
