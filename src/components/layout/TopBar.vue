<script setup>
import { ref, computed } from 'vue'
import { state } from '../../stores/sensors.js'
import StatusBadge from '../ui/StatusBadge.vue'
import AppIcon from '../ui/AppIcon.vue'
defineProps({ showMenu: { type: Boolean, default: false }, profileName: { type: String, default: 'Tamu' }, menuOpen: { type: Boolean, default: false }, hideProfile: Boolean })
defineEmits(['toggle-sidebar'])
const theme = ref(document.documentElement.dataset.theme || 'light')
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme.value
}
const today = new Date().toISOString().slice(0, 10)
const picked = ref(today)
const label = computed(() => new Date(picked.value + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }))
function openPicker(e) { e.currentTarget.querySelector('input')?.showPicker?.() }
</script>
<template>
  <header class="topbar">
    <button v-if="showMenu" class="ham" :class="{ open: menuOpen }" @click="$emit('toggle-sidebar')" aria-label="Buka menu">
      <span class="ham-bar"></span><span class="ham-bar"></span><span class="ham-bar"></span>
    </button>
    <div class="t-left">
      <span class="welcome">Welcome {{ profileName }}</span>
    </div>
    <div class="t-right">
      <StatusBadge class="hide-mobile" :status="state.systemStatus" />
      <RouterLink to="/alert" class="icon-btn hide-mobile" aria-label="Notifikasi">
        <AppIcon name="bell" :size="20" />
      </RouterLink>
      <button class="date" @click="openPicker" aria-label="Ganti tanggal">
        <AppIcon name="calendar" :size="18" /><span class="num">{{ label }}</span>
        <input v-model="picked" type="date" :max="today" class="date-input" aria-label="Pilih tanggal" tabindex="-1" />
      </button>
      <div v-if="!hideProfile" class="profile profile--right" aria-label="Profile">
        <span class="avatar" aria-hidden="true"><AppIcon name="user" :size="18" /></span>
      </div>
    </div>
  </header>
</template>
<style scoped>
.topbar { position: sticky; top: 0; z-index: 40; height: var(--topbar-h); display: flex; align-items: center; gap: 10px; padding: 0 16px; background: #fff; border-bottom: 1px solid var(--color-border); }
.t-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.profile { display: inline-flex; align-items: center; gap: 10px; min-width: 0; }
.profile--right { margin-left: 4px; }
.avatar { width: 36px; height: 36px; border-radius: 999px; background: #eef0f7; color: #04044A; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; border: 1px solid var(--color-border); }
.welcome { font-size: 14px; font-weight: 700; color: var(--color-text); white-space: nowrap; }
@media (max-width: 639px) {
  .welcome { font-size: 13px; }
  .hide-mobile { display: none !important; }
  .date { min-height: 32px; padding: 0 8px; gap: 6px; font-size: 11px; border-radius: 6px; }
  .date :deep(svg), .date svg { width: 14px; height: 14px; }
  .date-input { min-height: 32px; }
}
.date { position: relative; display: inline-flex; align-items: center; gap: 8px; min-height: 40px; padding: 0 12px; border-radius: 8px; border: 1px solid transparent; background: transparent; color: var(--color-text); font-size: 14px; font-weight: 600; cursor: pointer; }
.date:hover { background: var(--color-bg); }
.date-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; min-height: 40px; }
.t-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.icon-btn { position: relative; width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid transparent; background: transparent; color: var(--color-text-muted); cursor: pointer; text-decoration: none; }
.icon-btn:hover { background: var(--color-bg); color: var(--color-text); }
.icon-btn:active { transform: scale(0.96); }
/* hamburger 2027 — borderless, 3 bar dengan pill rounded, morph ke X */
.ham { width: 40px; height: 40px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border: 0; background: transparent; cursor: pointer; padding: 0; flex: 0 0 auto; }
.ham-bar { display: block; width: 20px; height: 2.5px; border-radius: 999px; background: var(--color-text); transition: transform 260ms var(--ease-out), opacity 200ms var(--ease-out), width 260ms var(--ease-out); }
.ham-bar:nth-child(2) { width: 14px; align-self: center; }
.ham:hover .ham-bar { background: var(--color-primary); }
.ham.open .ham-bar:nth-child(1) { transform: translateY(7.5px) rotate(45deg); width: 20px; }
.ham.open .ham-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.ham.open .ham-bar:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); width: 20px; }
.ham:active { transform: scale(0.96); }
@media (prefers-reduced-motion: reduce) { .ham-bar { transition-duration: 1ms !important; } }
@media (min-width: 640px) { .topbar { padding: 0 20px; } }
@media (min-width: 1024px) { .topbar { padding: 0 24px; } }
</style>
