<script setup>
import { RouterView } from 'vue-router'
import { ref, computed } from 'vue'
import SidebarNav from '../components/layout/SidebarNav.vue'
import TopBar from '../components/layout/TopBar.vue'
import { useBreakpoint } from '../composables/useBreakpoint.js'
const { width } = useBreakpoint()
const isMobile = computed(() => width.value < 640)
const manualFold = ref(null)
const collapsed = computed(() => manualFold.value ?? (width.value >= 640 && width.value < 1024))
const drawerOpen = ref(false)
const profileName = ref('Alex')
function onToggleSidebar() {
  if (isMobile.value) drawerOpen.value = !drawerOpen.value
  else manualFold.value = !collapsed.value
}
function closeDrawer() { drawerOpen.value = false }
</script>
<template>
  <div class="shell">
    <SidebarNav v-if="!isMobile" :collapsed="collapsed" @toggle="onToggleSidebar" />
    <Transition name="drawer">
      <SidebarNav v-if="isMobile && drawerOpen" :collapsed="false" class="drawer" :profile-name="profileName" drawer @toggle="closeDrawer" />
    </Transition>
    <Transition name="fade">
      <div v-if="isMobile && drawerOpen" class="drawer-backdrop" @click="closeDrawer"></div>
    </Transition>
    <div class="main" :class="!isMobile ? (collapsed ? 'ml-68' : 'ml-230') : ''">
      <TopBar :show-menu="isMobile" :menu-open="drawerOpen" :profile-name="profileName" :hide-profile="isMobile" @toggle-sidebar="onToggleSidebar" />
      <div class="page-wrap"><RouterView /></div>
    </div>
  </div>
</template>
<style scoped>
.shell { min-height: 100dvh; max-width: 100vw; overflow: visible; }
.main { transition: margin 360ms cubic-bezier(0.32, 0.72, 0, 1); max-width: 100%; min-width: 0; will-change: margin; display: flex; flex-direction: column; min-height: 100dvh; overflow: visible; }
.main :deep(.topbar) { position: sticky; top: 0; z-index: 40; }
.page-wrap { min-width: 0; overflow: visible; }
.drawer { z-index: 55 !important; box-shadow: 8px 0 32px rgba(15,23,42,0.18); }
.drawer-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.32); backdrop-filter: blur(2px); z-index: 50; }
/* super smooth drawer — buka/tutup mobile */
.drawer-enter-active { transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-leave-active { transition: transform 360ms cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(-100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 300ms var(--ease-out); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@media (min-width: 1024px) { .ml-230 { margin-left: 230px; } .ml-68 { margin-left: 68px; } }
@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active, .drawer-leave-active, .fade-enter-active, .fade-leave-active { transition-duration: 1ms !important; }
}
</style>
