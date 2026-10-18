<script setup>
import { state, toggleActuator } from '../stores/sensors.js'
import KpiCard from '../components/ui/KpiCard.vue'
import TrendChart from '../components/charts/TrendChart.vue'
import ToggleSwitch from '../components/ui/ToggleSwitch.vue'
const fan = state.actuators.find(a => a.id === 'FAN_1')
</script>
<template>
  <main class="page">
    <section class="grid-kpi grid-kpi--single">
      <KpiCard label="Suhu udara" :value="state.climate.airTemp" unit="°C" :status="state.climate.airTemp > 30 ? 'warning' : 'ok'" icon="thermo" />
      <KpiCard label="Kelembapan" :value="state.climate.humidity" unit="%" status="ok" icon="drop" />
      <KpiCard label="Cahaya" :value="state.climate.lux" unit="lux" status="ok" icon="sun" />
      <KpiCard label="Exhaust fan" :value="fan.on ? 'ON' : 'OFF'" unit="" :status="fan.on ? 'warning' : 'ok'" icon="fan" />
    </section>
    <section class="grid-2">
      <div class="card"><h2 class="h2">Suhu dan kelembapan</h2>
        <TrendChart :points="[28,29,30,31,31.5,31,30]" label="Suhu udara 24 jam, ambang fan 30°C" :threshold="30" />
      </div>
      <div class="card"><h2 class="h2">Kontrol fan</h2>
        <div class="row"><span>Mode otomatis (nyala di atas 30°C)</span>
          <ToggleSwitch :model-value="fan.on" label="Exhaust fan" @update:model-value="toggleActuator('FAN_1')" />
        </div>
        <label class="field">Ambang suhu (°C)<input type="number" value="30" min="25" max="35" /></label>
      </div>
    </section>
  </main>
</template>
<style scoped>
.row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 64px; }
.field { margin-top: 12px; }
</style>
