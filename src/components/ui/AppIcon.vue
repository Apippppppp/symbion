<script setup>
import { computed } from 'vue'
// Satu set ikon garis 24x24, stroke konsisten 1.8, round cap.
// ponytail: ganti lucide-vue-next bila butuh >30 ikon, API prop `name` tetap.
const props = defineProps({ name: { type: String, default: 'overview' }, size: { type: Number, default: 20 } })
const paths = {
  overview: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z"/><path d="M9 4v14M15 6v14"/>',
  waves: '<path d="M3 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>',
  sprout: '<path d="M12 20v-7"/><path d="M12 13c0-3.5 2.5-6 7-6 0 3.5-2.5 6-7 6Z"/><path d="M12 13c0-3-2-5-6-5 0 3 2 5 6 5Z"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18.3 10 3.8 3.8 0 0 1 17.5 18H7Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19"/>',
  sliders: '<path d="M5 7h14M5 12h14M5 17h14"/><circle cx="10" cy="7" r="2.2" fill="var(--color-surface)"/><circle cx="15" cy="12" r="2.2" fill="var(--color-surface)"/><circle cx="9" cy="17" r="2.2" fill="var(--color-surface)"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10Z"/><path d="M10 19a2.2 2.2 0 0 0 4 0"/>',
  file: '<path d="M6 3.5h8L19 8.5V20.5H6V3.5Z"/><path d="M13.5 3.5v5.5H19"/><path d="M9 14.5v3M12 13v4.5M15 15.5v2"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chevL: '<path d="M14.5 5 8 12l6.5 7"/>',
  chevR: '<path d="M9.5 5 16 12l-6.5 7"/>',
  thermo: '<path d="M10 4a2 2 0 0 1 4 0v9.3a4.5 4.5 0 1 1-4 0V4Z"/><circle cx="12" cy="17.5" r="1.6"/>',
  drop: '<path d="M12 3.5S6 10 6 14a6 6 0 0 0 12 0c0-4-6-10.5-6-10.5Z"/>',
  battery: '<rect x="3" y="8" width="15" height="9" rx="2.5"/><path d="M21 11v3"/><rect x="5.5" y="10.5" width="7" height="4" rx="1"/>',
  plug: '<path d="M9 3.5V8M15 3.5V8M7 8h10v4a5 5 0 0 1-10 0V8Z"/><path d="M12 17v3.5"/>',
  bolt: '<path d="M13 2.5 5 13.5h6L11 21.5l8-11h-6l0-8Z"/>',
  fan: '<circle cx="12" cy="12" r="2"/><path d="M12 10C10 7 10 4.5 12 3.5c2 1 2 3.5 0 6.5ZM14 12c2.5.5 4.5 2.5 4 4.5-2 .5-4.5-1-4-4.5ZM10 12c-2.5-.5-4.5-2.5-4-4.5 2-.5 4.5 1 4 4.5Z"/>',
  flask: '<path d="M10 3.5h4M10.5 3.5V9l-5 10a1.5 1.5 0 0 0 1.3 2.2h10.4A1.5 1.5 0 0 0 18.5 19l-5-10V3.5"/>',
  moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z"/>',
  dots: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5a7 7 0 0 1 14 0"/>',
}
const inner = computed(() => paths[props.name] ?? paths.overview)
</script>
<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="inner" />
</template>
