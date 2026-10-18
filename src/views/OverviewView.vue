<script setup>
import { RouterLink } from 'vue-router'
import { state } from '../stores/sensors.js'
import { statusOf } from '../composables/useThresholds.js'
import KpiCard from '../components/ui/KpiCard.vue'
import TrendChart from '../components/charts/TrendChart.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
const kpis = [
  { id: 1, label: 'Suhu Air (kiri)', value: state.ponds.POND_L.temp, unit: '°C', status: statusOf('waterTemp', state.ponds.POND_L.temp), icon: 'thermo', trend: '+0,4° / 1 jam' },
  { id: 2, label: 'pH Air (kiri)', value: state.ponds.POND_L.ph, unit: '', status: statusOf('ph', state.ponds.POND_L.ph), icon: 'flask', trend: 'di atas ideal' },
  { id: 3, label: 'DO (kiri)', value: state.ponds.POND_L.do, unit: 'mg/L', status: statusOf('do', state.ponds.POND_L.do), icon: 'drop', trend: 'aerator ON' },
  { id: 4, label: 'Suhu Udara', value: state.climate.airTemp, unit: '°C', status: state.climate.airTemp > 30 ? 'warning' : 'ok', icon: 'cloud', trend: 'fan ON' },
  { id: 5, label: 'Kelembapan', value: state.climate.humidity, unit: '%', status: 'ok', icon: 'drop', trend: 'ideal 60-80%' },
  { id: 6, label: 'Daya Surya', value: state.energy.solarW, unit: 'W', status: 'ok', icon: 'sun', trend: 'produksi naik' },
  { id: 7, label: 'Baterai', value: state.energy.soc, unit: '%', status: 'ok', icon: 'battery', trend: '±6 jam' },
]
</script>
<template>
  <main class="page">
    <KpiCard v-for="k in kpis.filter(k => k.label === 'Suhu Udara')" :key="'b-' + k.id" v-bind="k" variant="banner" />
    <section aria-label="Indikator utama"><div class="grid-kpi">
      <KpiCard v-for="k in kpis.filter(k => k.label !== 'Suhu Udara')" :key="k.id" v-bind="k" />
    </div></section>
    <section class="card" aria-label="Tren"><h2 class="h2">Tren 24 jam: suhu air</h2>
      <TrendChart :points="[27,27.5,28,28.4,29,30,31,31.2]" label="Suhu air kolam kiri, ambang warning 32°C" :threshold="32" />
    </section>
    <section class="grid-2" aria-label="Aktuator dan alert">
      <div class="card"><h2 class="h2">Aktuator</h2>
        <ul class="act">
          <li v-for="a in state.actuators.slice(0,3)" :key="a.id">
            <span>{{ a.name }}</span><StatusBadge :status="a.on ? 'ok' : 'offline'" />
          </li>
        </ul>
        <RouterLink to="/kontrol" class="btn btn-secondary" style="margin-top:12px">Buka kontrol</RouterLink>
      </div>
      <div class="card alert-card"><h2 class="h2">Alert terbaru</h2>
        <ul class="alerts">
          <li v-for="a in state.alerts.slice(0,3)" :key="a.id">
            <StatusBadge :status="a.severity" /><span class="alert-msg">{{ a.message }}</span><span class="caption num">{{ a.ts }}</span>
          </li>
        </ul>
        <RouterLink to="/alert" class="btn btn-secondary" style="margin-top:12px">Lihat semua</RouterLink>
      </div>
    </section>
  </main>
</template>
<style scoped>
.act, .alerts { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.act li, .alerts li { display: flex; align-items: center; gap: 10px; justify-content: space-between; min-width: 0; }
.alerts li { justify-content: flex-start; flex-wrap: nowrap; }
.alert-msg { flex: 1 1 auto; min-width: 0; }
.alert-card .alerts li { flex-wrap: nowrap; }
@media (max-width: 639px) {
  .alert-card { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; overscroll-behavior-x: contain; }
  .alert-card::-webkit-scrollbar { display: none; }
  .alert-card .alerts { min-width: max-content; }
  .alert-card .alerts li { flex-wrap: nowrap; white-space: nowrap; }
  .alert-card .alert-msg, .alert-card .caption { white-space: nowrap; }
}
@media (min-width: 640px) {
  .alert-card { overflow: visible; }
  .alert-card .alerts { min-width: 0; }
}
</style>
