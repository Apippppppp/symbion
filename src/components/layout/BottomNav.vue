<script setup>
import { useRoute } from 'vue-router'
import AppIcon from '../ui/AppIcon.vue'
const route = useRoute()
const items = [
  { to: '/', label: 'Overview', icon: 'overview' },
  { to: '/denah', label: 'Denah', icon: 'map' },
  { to: '/kolam', label: 'Kolam', icon: 'waves' },
  { to: '/hidroponik', label: 'Hidroponik', icon: 'sprout' },
  { to: '/kontrol', label: 'Kontrol', icon: 'sliders' },
]
const more = ['/iklim', '/energi', '/alert', '/laporan', '/pengaturan']
defineProps({ showMore: Boolean })
defineEmits(['toggle-more'])
</script>
<template>
  <nav class="bottomnav" aria-label="Navigasi utama">
    <RouterLink v-for="i in items" :key="i.to" :to="i.to" class="b-item" :class="{ active: route.path === i.to }">
      <AppIcon :name="i.icon" :size="22" /><small>{{ i.label }}</small>
    </RouterLink>
    <button class="b-item" :class="{ active: more.includes(route.path) }" @click="$emit('toggle-more')" aria-haspopup="true">
      <AppIcon name="dots" :size="22" /><small>Lainnya</small>
    </button>
  </nav>
</template>
<style scoped>
.bottomnav { position: fixed; bottom: 0; left: 0; right: 0; height: calc(var(--nav-h) + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom); display: flex; background: var(--color-surface); border-top: 1px solid var(--color-border); z-index: 40; }
.b-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; color: var(--color-text-muted); text-decoration: none; background: none; border: 0; cursor: pointer; min-height: 44px; font-size: 11px; }
.b-item small { font-size: 11px; }
.b-item.active { color: var(--color-accent-green); font-weight: 700; }
</style>
