import { ref, onMounted, onUnmounted } from 'vue'

export function useBreakpoint() {
  const w = ref(window.innerWidth)
  let onResize = () => { w.value = window.innerWidth }
  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))
  return {
    isMobile: () => w.value < 640,
    isTablet: () => w.value >= 640 && w.value < 1024,
    isDesktop: () => w.value >= 1024,
    width: w,
  }
}
