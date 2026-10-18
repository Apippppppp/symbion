<script setup>
import { state } from '../stores/sensors.js'
import KpiCard from '../components/ui/KpiCard.vue'
import TrendChart from '../components/charts/TrendChart.vue'
</script>
<template>
  <main class="page">
    <section class="grid-kpi grid-kpi--single">
      <KpiCard label="Produksi panel" :value="state.energy.solarW" unit="W" status="ok" icon="sun" />
      <KpiCard label="Beban" :value="state.energy.loadW" unit="W" status="ok" icon="plug" />
      <KpiCard label="Baterai (SoC)" :value="state.energy.soc" unit="%" status="ok" icon="battery" />
      <KpiCard label="Energi hari ini" :value="state.energy.todayKWh" unit="kWh" status="ok" icon="bolt" />
    </section>
    <section class="grid-2">
      <div class="card"><h2 class="h2">Produksi vs konsumsi</h2>
        <TrendChart :points="[1,2,4,6,7,8,7,5]" label="Daya panel hari ini (kW x100)" />
      </div>
      <div class="card"><h2 class="h2">Baterai</h2>
        <p class="big num">{{ state.energy.soc }}<span>%</span></p>
        <div class="bar" role="progressbar" :aria-valuenow="state.energy.soc" aria-valuemin="0" aria-valuemax="100" aria-label="Kapasitas baterai">
          <i :style="{ width: state.energy.soc + '%' }"></i>
        </div>
        <p class="muted">Estimasi runtime beban saat ini: ±6 jam. Batas hemat aktif di bawah 20%.</p>
      </div>
    </section>
  </main>
</template>
<style scoped>
.big { font-size: 36px; font-weight: 700; color: var(--color-primary); margin: 0 0 8px; }
.big span { font-size: 14px; color: var(--color-text-muted); font-weight: 500; }
.bar { height: 10px; border-radius: 5px; background: var(--color-bg); overflow: hidden; }
.bar i { display: block; height: 100%; background: var(--color-leaf); }
</style>
