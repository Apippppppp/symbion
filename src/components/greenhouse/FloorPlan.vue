<script setup>
// Denah SVG viewBox 800x500 (rasio 8:5). Zona 3m-2m-3m = 300/200/300 unit.
import { computed } from 'vue'
import { state } from '../../stores/sensors.js'
import { statusOf } from '../../composables/useThresholds.js'
const props = defineProps({ layers: { type: Array, default: () => ['fish', 'hydro', 'climate', 'energy'] }, selected: String })
const emit = defineEmits(['select'])
const pins = computed(() => [
  { id: 'POND_L', x: 150, y: 300, label: 'Kolam Kiri', val: `${state.ponds.POND_L.temp}°C, pH ${state.ponds.POND_L.ph}`, s: statusOf('ph', state.ponds.POND_L.ph), layer: 'fish' },
  { id: 'POND_R', x: 650, y: 300, label: 'Kolam Kanan', val: `${state.ponds.POND_R.temp}°C, pH ${state.ponds.POND_R.ph}`, s: statusOf('ph', state.ponds.POND_R.ph), layer: 'fish' },
  { id: 'HYDRO_L1', x: 150, y: 180, label: 'Paralon L1', val: `pH ${state.hydro.HYDRO_L1.ph}, EC ${state.hydro.HYDRO_L1.ec}`, s: 'ok', layer: 'hydro' },
  { id: 'HYDRO_R1', x: 650, y: 180, label: 'Paralon R1', val: `pH ${state.hydro.HYDRO_R1.ph}, EC ${state.hydro.HYDRO_R1.ec}`, s: 'ok', layer: 'hydro' },
  { id: 'FAN_1', x: 400, y: 60, label: 'Exhaust fan', val: state.climate.fanOn ? 'Menyala' : 'Mati', s: state.climate.fanOn ? 'warning' : 'ok', layer: 'climate' },
  { id: 'SOLAR', x: 400, y: 22, label: 'Panel surya', val: `${state.energy.solarW} W`, s: 'ok', layer: 'energy' },
])
const pinColor = (s) => s === 'critical' ? '#D64545' : s === 'warning' ? '#F5A623' : s === 'offline' ? '#9AA5AD' : '#2E9E4F'
</script>
<template>
  <svg viewBox="0 0 800 500" class="plan" role="img" aria-label="Denah greenhouse 8 kali 5 meter">
    <rect x="0" y="0" width="800" height="500" rx="8" class="frame" />
    <rect x="8" y="8" width="784" height="34" rx="4" class="solar" v-if="layers.includes('energy')" />
    <text x="400" y="31" text-anchor="middle" class="anno">PANEL SURYA</text>
    <rect x="8" y="42" width="292" height="450" class="zone" />
    <rect x="300" y="42" width="200" height="450" class="walk" />
    <rect x="500" y="42" width="292" height="450" class="zone" />
    <text x="154" y="60" text-anchor="middle" class="anno">3 m</text>
    <text x="400" y="60" text-anchor="middle" class="anno">2 m</text>
    <text x="646" y="60" text-anchor="middle" class="anno">3 m</text>
    <g v-if="layers.includes('fish')">
      <rect x="28" y="200" width="252" height="220" rx="6" class="pond" />
      <rect x="520" y="200" width="252" height="220" rx="6" class="pond" />
    </g>
    <g v-if="layers.includes('hydro')">
      <rect x="28" y="120" width="252" height="26" rx="13" class="pipe" />
      <rect x="28" y="156" width="252" height="26" rx="13" class="pipe" />
      <rect x="520" y="120" width="252" height="26" rx="13" class="pipe" />
      <rect x="520" y="156" width="252" height="26" rx="13" class="pipe" />
    </g>
    <rect x="700" y="430" width="56" height="44" rx="6" class="filter" v-if="layers.includes('fish')" />
    <text x="728" y="456" text-anchor="middle" class="anno">Filter</text>
    <g v-for="p in pins.filter(p => layers.includes(p.layer))" :key="p.id">
      <circle :cx="p.x" :cy="p.y" r="12" :fill="pinColor(p.s)" class="pin" @click="emit('select', p)" @keydown.enter="emit('select', p)" tabindex="0" :aria-label="`${p.label}: ${p.val}`" />
      <circle :cx="p.x" :cy="p.y" r="12" fill="none" stroke="#fff" stroke-width="2" />
    </g>
    <text x="8" y="498" class="dim">8 m</text>
    <text x="794" y="270" text-anchor="end" class="dim">5 m</text>
  </svg>
</template>
<style scoped>
.plan { width: 100%; height: auto; aspect-ratio: 8 / 5; display: block; }
.frame { fill: var(--color-surface); stroke: var(--color-border); }
.zone { fill: none; stroke: var(--color-border); stroke-dasharray: 6 4; }
.walk { fill: rgba(90,103,112,.12); }
.solar { fill: var(--color-secondary); opacity: .85; }
.pond { fill: rgba(14,90,107,.28); stroke: var(--color-water); stroke-width: 2; }
.pipe { fill: #fff; stroke: var(--color-border); stroke-width: 2; }
.filter { fill: var(--color-secondary); }
.anno { font-size: 10px; font-weight: 600; fill: var(--color-text-muted); }
.plan text { font-family: inherit; }
.dim { font-size: 12px; font-weight: 700; fill: var(--color-primary); }
.pin { cursor: pointer; }
.pin:focus-visible { outline: 2px solid var(--color-secondary); }
@media (min-width: 1024px) { .anno, .dim { font-size: 12px; } }
</style>
