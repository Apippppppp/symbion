<script setup>
import { ref, computed } from 'vue'
import { state } from '../stores/sensors.js'
import { statusOf } from '../composables/useThresholds.js'
import GaugeChart from '../components/ui/GaugeChart.vue'
import PondCrossSection from '../components/greenhouse/PondCrossSection.vue'
import TrendChart from '../components/charts/TrendChart.vue'
const tab = ref('POND_L')
const ids = computed(() => tab.value === 'BOTH' ? ['POND_L', 'POND_R'] : [tab.value])
function gauges(id) {
  const p = state.ponds[id]
  return [
    { label: 'Suhu', value: p.temp, unit: '°C', min: 20, max: 36, s: statusOf('waterTemp', p.temp) },
    { label: 'pH', value: p.ph, unit: '', min: 5, max: 9.5, s: statusOf('ph', p.ph) },
    { label: 'DO', value: p.do, unit: 'mg/L', min: 0, max: 8, s: statusOf('do', p.do) },
    { label: 'Amonia', value: p.nh3, unit: 'ppm', min: 0, max: 2.5, s: statusOf('nh3', p.nh3) },
    { label: 'Level', value: p.levelCm, unit: 'cm', min: 0, max: 70, s: statusOf('level', p.levelCm) },
  ]
}
</script>
<template>
  <main class="page">
    <div class="seg" role="group" aria-label="Pilih kolam">
      <button :aria-pressed="tab==='POND_L'" @click="tab='POND_L'">Kiri</button>
      <button :aria-pressed="tab==='POND_R'" @click="tab='POND_R'">Kanan</button>
      <button :aria-pressed="tab==='BOTH'" @click="tab='BOTH'">Bandingkan</button>
    </div>
    <section v-for="id in ids" :key="id" class="card" :aria-label="state.ponds[id].name">
      <h2 class="h2">{{ state.ponds[id].name }}</h2>
      <div class="gauge-row">
        <GaugeChart v-for="g in gauges(id)" :key="g.label" v-bind="g" :status="g.s" />
      </div>
      <div class="grid-2" style="margin-top:16px">
        <PondCrossSection :level-cm="state.ponds[id].levelCm" />
        <TrendChart :points="[7.0,7.1,7.4,7.8,8.0,8.3]" label="Riwayat pH 24 jam" :threshold="8.5" />
      </div>
    </section>
  </main>
</template>
<style scoped>
.gauge-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 12px; }
@media (min-width: 1024px) { .gauge-row { grid-template-columns: repeat(5, 1fr); } }
</style>
