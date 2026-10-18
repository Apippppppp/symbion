<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from '../ui/AppIcon.vue'
const props = defineProps({ collapsed: Boolean, profileName: { type: String, default: '' }, drawer: Boolean })
defineEmits(['toggle'])
const route = useRoute()
const router = useRouter()
const topItems = [
  { to: '/', label: 'Overview', icon: 'overview' },
  { to: '/denah', label: 'Denah', icon: 'map' },
  { to: '/kolam', label: 'Kolam', icon: 'waves' },
]
const hydroChildren = [
  { to: '/iklim', label: 'Iklim', icon: 'cloud' },
  { to: '/energi', label: 'Energi', icon: 'sun' },
  { to: '/kontrol', label: 'Kontrol', icon: 'sliders' },
  { to: '/alert', label: 'Alert', icon: 'bell' },
]
const bottomItems = [
  { to: '/laporan', label: 'Laporan', icon: 'file' },
  { to: '/pengaturan', label: 'Pengaturan', icon: 'gear' },
]
const hydroPaths = ['/hidroponik', ...hydroChildren.map(c=>c.to)]
const isHydroActive = computed(() => hydroPaths.includes(route.path))
const isHydroChildActive = computed(() => hydroChildren.some(c => c.to === route.path))
const hydroOpen = ref(isHydroActive.value)
watch(isHydroActive, v => { if (v) hydroOpen.value = true })
function toggleHydro() { hydroOpen.value = !hydroOpen.value }
function onHydroParentClick() {
  if (props.collapsed) { hydroOpen.value = true; return }
  if (hydroOpen.value && isHydroActive.value) { hydroOpen.value = false; return }
  hydroOpen.value = true
  if (route.path !== '/kontrol') router.push('/kontrol')
}
</script>
<template>
  <aside class="side" :class="{ collapsed: props.collapsed }" aria-label="Navigasi samping">
    <div class="brand" aria-label="SYMBION">
      <div class="brand-logos">
        <img src="/logo/logo1.webp" alt="SYMBION" class="logo logo--collapsed" :class="{ on: props.collapsed }" loading="eager" decoding="async" />
        <img src="/logo/logo2.webp" alt="SYMBION" class="logo logo--expanded" :class="{ on: !props.collapsed }" loading="eager" decoding="async" />
      </div>
    </div>
    <nav class="menu">
      <RouterLink v-for="i in topItems" :key="i.to" :to="i.to" class="s-item" :title="i.label" v-slot="{ isActive, isExactActive }">
        <span class="s-item-bg" :class="{ on: isActive || isExactActive }" aria-hidden="true"></span>
        <span class="s-item-content">
          <AppIcon :name="i.icon" :size="18" />
          <small class="s-label">{{ i.label }}</small>
        </span>
      </RouterLink>

      <!-- Hidroponik: hanya tombol induk, isi pindah ke Kontrol, sub tetap di sini -->
      <div class="hydro-group" :class="{ open: hydroOpen, 'parent-on': isHydroActive }">
        <button class="s-item s-parent" :class="{ 's-parent--on': isHydroActive }" :title="'Hidroponik'" :aria-expanded="hydroOpen" @click="onHydroParentClick">
          <span class="s-item-bg" :class="{ on: isHydroActive }" aria-hidden="true"></span>
          <span class="s-item-content s-parent-content">
            <AppIcon name="sprout" :size="18" />
            <small class="s-label">Hidroponik</small>
            <span v-if="!props.collapsed" class="s-arrow" aria-hidden="true">
              <AppIcon name="chevR" :size="14" />
            </span>
          </span>
        </button>
        <div v-if="!props.collapsed" class="s-sub-wrap" :class="{ open: hydroOpen }">
          <div class="s-sub-inner">
            <RouterLink v-for="c in hydroChildren" :key="c.to" :to="c.to" class="s-item s-sub" :class="{ 's-sub--on': route.path === c.to }" :title="c.label" v-slot="{ isActive, isExactActive }">
              <span class="s-item-bg" :class="{ on: isActive || isExactActive }" aria-hidden="true"></span>
              <span class="s-item-content">
                <AppIcon :name="c.icon" :size="16" />
                <small class="s-label">{{ c.label }}</small>
                <span v-if="isActive || isExactActive" class="s-sub-dot" aria-hidden="true"></span>
              </span>
            </RouterLink>
          </div>
        </div>
      </div>

      <RouterLink v-for="i in bottomItems" :key="i.to" :to="i.to" class="s-item" :title="i.label" v-slot="{ isActive, isExactActive }">
        <span class="s-item-bg" :class="{ on: isActive || isExactActive }" aria-hidden="true"></span>
        <span class="s-item-content">
          <AppIcon :name="i.icon" :size="18" />
          <small class="s-label">{{ i.label }}</small>
        </span>
      </RouterLink>
    </nav>
    <div v-if="props.drawer" class="drawer-foot">
      <span class="drawer-avatar" aria-hidden="true"><AppIcon name="user" :size="18" /></span>
      <small class="s-label drawer-name">{{ props.profileName || 'Tamu' }}</small>
    </div>
    <button class="fold" @click="$emit('toggle')" :aria-label="props.collapsed ? 'Buka sidebar' : 'Tutup sidebar'" :aria-expanded="!props.collapsed">
      <AppIcon :name="props.collapsed ? 'chevR' : 'chevL'" :size="18" />
      <small class="fold-label">Tutup</small>
    </button>
  </aside>
</template>
<style scoped>
.side {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 230px;
  background: #000675;
  padding: 0;
  display: flex;
  flex-direction: column;
  z-index: 40;
  transition: width 360ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: width;
  overflow: hidden;
}
.side.collapsed { width: 68px; }
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  min-height: 64px;
  padding: 0 10px;
  flex-shrink: 0;
  overflow: hidden;
}
.brand-logos {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo {
  position: absolute;
  top: 50%;
  left: 50%;
  object-fit: contain;
  pointer-events: none;
  will-change: transform, opacity, filter;
  opacity: 0;
  filter: blur(8px);
  transform: translate(-50%, -50%) scale(0.88);
  transition:
    opacity 280ms cubic-bezier(0.25, 1, 0.5, 1),
    transform 420ms cubic-bezier(0.32, 0.72, 0, 1),
    filter 320ms cubic-bezier(0.25, 1, 0.5, 1);
}
.logo--collapsed { width: 36px; height: 36px; }
.logo--expanded {
  width: 200px;
  height: 44px;
  max-width: 206px;
  left: 12px;
  right: auto;
  transform: translateY(-50%) scale(0.88);
}
.logo.on { opacity: 1; filter: blur(0); transform: translate(-50%, -50%) scale(1); }
.logo--expanded.on { transform: translateY(-50%) scale(1); }
.logo--expanded:not(.on) { transform: translateY(-50%) scale(0.88); }
.logo:not(.on) { transition-duration: 260ms, 360ms, 260ms; }
.menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 0 12px;
  overflow-y: auto;
}
.s-item {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 0 0 22px;
  margin-right: 0;
  color: rgba(255,255,255,0.88);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 0;
  isolation: isolate;
  border: 0;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
}
.s-item-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 40px;
  transition: color 220ms var(--ease-out);
  width: 100%;
}
.s-parent-content { padding-right: 8px; }
.s-item :deep(svg) { flex: 0 0 auto; opacity: 0.95; }
.s-label,
.fold-label {
  white-space: nowrap;
  overflow: hidden;
  max-width: 140px;
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity 220ms cubic-bezier(0.25, 1, 0.5, 1),
    transform 360ms cubic-bezier(0.32, 0.72, 0, 1),
    max-width 360ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: opacity, transform, max-width;
}
.side.collapsed .s-label,
.side.collapsed .fold-label {
  max-width: 0;
  opacity: 0;
  transform: translateX(-10px);
  pointer-events: none;
}
.s-item:hover { color: #fff; }
.s-item:hover .s-item-bg:not(.on) { background: rgba(255,255,255,0.10); }
.s-item-bg {
  position: absolute;
  inset: 0 0 0 6px;
  border-radius: 20px 0 0 20px;
  background: transparent;
  transition: background 260ms var(--ease-out), transform 260ms var(--ease-out), opacity 220ms var(--ease-out);
  transform: scaleX(0.96);
  transform-origin: left center;
  opacity: 0;
  pointer-events: none;
}
.s-item-bg.on {
  background: var(--color-bg);
  transform: scaleX(1);
  opacity: 1;
}
.s-item:has(.s-item-bg.on) { color: #000675; font-weight: 700; }
.s-item:has(.s-item-bg.on) .s-item-content { color: #000675; }
.s-item:has(.s-item-bg.on) :deep(svg) { color: #000675; }
.side.collapsed .s-item {
  justify-content: center;
  padding: 0;
  width: 44px;
  min-width: 44px;
  margin: 0 auto;
  border-radius: 12px;
}
.side.collapsed .s-item-content { justify-content: center; gap: 0; }
.side.collapsed .s-item-bg { inset: 0; border-radius: 12px; transform: scale(0.9); }
.side.collapsed .s-item-bg.on { transform: scale(1); }
/* hydro group — parent tetap ON saat sub aktif */
.hydro-group { display: flex; flex-direction: column; gap: 2px; }
.s-parent { cursor: pointer; }
.s-parent--on { color: #000675; font-weight: 700; }
.s-arrow {
  margin-left: auto;
  width: 24px; height: 24px;
  border-radius: 999px;
  border: 0;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.92);
  display: inline-flex; align-items: center; justify-content: center;
  flex: 0 0 auto;
  transition: transform 260ms var(--ease-out), background 160ms var(--ease-out);
}
.hydro-group.open .s-arrow { transform: rotate(90deg); background: rgba(255,255,255,0.18); }
.s-parent--on .s-arrow { background: rgba(0,6,117,0.08); color: #000675; }
.s-arrow:hover { background: rgba(255,255,255,0.20); }
.s-sub-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 300ms cubic-bezier(0.32, 0.72, 0, 1);
}
.s-sub-wrap.open { grid-template-rows: 1fr; }
.s-sub-inner {
  overflow: hidden;
  display: flex; flex-direction: column; gap: 2px;
  padding: 2px 0 2px 18px;
  border-left: 1px solid rgba(255,255,255,0.16);
  margin: 0 0 0 28px;
}
.s-sub { min-height: 36px; padding-left: 12px; font-size: 13px; opacity: 0.92; }
.s-sub .s-item-content { min-height: 36px; gap: 10px; }
.s-sub .s-item-bg { inset: 0 0 0 4px; border-radius: 16px 0 0 16px; }
.s-sub-dot {
  margin-left: auto;
  width: 6px; height: 6px; border-radius: 999px;
  background: #000675; flex: 0 0 auto;
}
.s-sub--on { font-weight: 700; }
.s-sub-wrap.open .s-sub { animation: subIn 300ms var(--ease-out) both; }
.s-sub-wrap.open .s-sub:nth-child(2) { animation-delay: 40ms; }
.s-sub-wrap.open .s-sub:nth-child(3) { animation-delay: 80ms; }
.s-sub-wrap.open .s-sub:nth-child(4) { animation-delay: 120ms; }
@keyframes subIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
.drawer-foot {
  display: flex; align-items: center; gap: 10px;
  margin: 8px 12px 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.12);
  color: #fff;
}
.drawer-avatar {
  width: 32px; height: 32px; border-radius: 999px;
  background: var(--color-bg); color: #000675;
  display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto;
}
.drawer-name { font-weight: 600; font-size: 13px; }
.fold {
  margin-top: auto;
  margin: auto 12px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.92);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}
.fold:hover { background: rgba(255,255,255,0.16); color: #fff; }
.fold:active { transform: scale(0.98); }
.side.collapsed .fold {
  margin: auto auto 12px;
  width: 44px; min-width: 44px;
  padding: 0; border-radius: 12px;
  aspect-ratio: 1;
}
.side.collapsed .hydro-group .s-sub-wrap { display: none; }
.side.collapsed .s-arrow { display: none; }
@media (prefers-reduced-motion: reduce) {
  .side, .logo, .s-label, .fold-label, .s-item-bg, .s-item-content, .s-sub-wrap { transition-duration: 1ms !important; }
}
</style>
