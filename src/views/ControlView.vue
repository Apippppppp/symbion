<script setup>
import { ref } from 'vue'
import { state, toggleActuator } from '../stores/sensors.js'
import KpiCard from '../components/ui/KpiCard.vue'
import ToggleSwitch from '../components/ui/ToggleSwitch.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
const showRule = ref(false)
const modes = ['auto', 'manual', 'jadwal']
const fan = state.actuators.find(a => a.id === 'FAN_1')
const pump = state.actuators.find(a => a.id === 'PUMP_1')
const aer = state.actuators.find(a => a.id === 'AERATOR_1')
</script>
<template>
  <main class="page">
    <section class="hydro-grid" aria-label="Hidroponik - empat paralon">
      <article v-for="(h, id) in state.hydro" :key="id" class="card card--compact">
        <h2 class="h3">{{ id.replace('_', ' ') }}</h2>
        <dl class="rows">
          <div><dt>pH</dt><dd class="num">{{ h.ph }}</dd></div>
          <div><dt>EC</dt><dd class="num">{{ h.ec }} mS/cm</dd></div>
          <div><dt>Suhu</dt><dd class="num">{{ h.temp }}°C</dd></div>
          <div><dt>Aliran</dt><dd class="num">{{ h.flow }} L/mnt</dd></div>
        </dl>
        <p class="caption">Umur {{ h.ageDay }} hari dari target 38 hari</p>
        <div class="bar" role="progressbar" :aria-valuenow="Math.min(100, Math.round(h.ageDay/38*100))" aria-valuemin="0" aria-valuemax="100" :aria-label="`Siklus tanam ${id}`">
          <i :style="{ width: Math.min(100, Math.round(h.ageDay/38*100)) + '%' }"></i>
        </div>
      </article>
    </section>
    <section class="card card--compact"><h2 class="h2">Catatan nutrisi</h2>
      <p class="muted">EC ideal 0,8–1,5 mS/cm, pH 5,8–6,5. Cek larutan tiap pagi, bilas paralon tiap panen.</p>
    </section>
    <section class="grid-kpi grid-kpi--single" aria-label="Ringkasan kontrol">
      <KpiCard label="Pompa sirkulasi" :value="pump.on ? 'ON' : 'OFF'" unit="" :status="pump.on ? 'ok' : 'offline'" icon="plug" />
      <KpiCard label="Aerator" :value="aer.on ? 'ON' : 'OFF'" unit="" :status="aer.on ? 'ok' : 'offline'" icon="drop" />
      <KpiCard label="Exhaust fan" :value="fan.on ? 'ON' : 'OFF'" unit="" :status="fan.on ? 'warning' : 'ok'" icon="fan" />
      <KpiCard label="Aturan aktif" :value="state.rules.filter(r=>r.on).length" unit="/ 3" status="ok" icon="sliders" />
    </section>
    <section class="act-grid act-grid--single" aria-label="Daftar aktuator">
      <article v-for="a in state.actuators" :key="a.id" class="card card--compact act-card">
        <div><h2 class="h3">{{ a.name }}</h2><p class="caption">{{ a.id }}</p></div>
        <ToggleSwitch :model-value="a.on" :label="a.name" @update:model-value="toggleActuator(a.id)" />
        <div class="seg modes" role="group" :aria-label="`Mode ${a.name}`">
          <button v-for="m in modes" :key="m" :aria-pressed="a.mode===m" @click="a.mode=m">{{ m }}</button>
        </div>
      </article>
    </section>
    <section class="card"><div class="rule-head"><h2 class="h2">Aturan IF–THEN</h2>
      <button class="btn btn-secondary" @click="showRule = !showRule">{{ showRule ? 'Tutup' : 'Tambah aturan' }}</button></div>
      <ul class="rules">
        <li v-for="r in state.rules" :key="r.id">
          <ToggleSwitch :model-value="r.on" :label="r.text" @update:model-value="r.on = !r.on" />
          <span>{{ r.text }}</span>
        </li>
      </ul>
      <form v-if="showRule" class="rule-form" @submit.prevent="showRule = false">
        <label class="field">Jika<input required placeholder="mis. DO < 3 mg/L" /></label>
        <label class="field">Maka<input required placeholder="mis. nyalakan aerator" /></label>
        <button class="btn btn-primary btn-full" type="submit">Simpan aturan</button>
      </form>
    </section>
    <section class="card"><h2 class="h2">Log aksi</h2>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Waktu</th><th>Pengguna</th><th>Aksi</th><th>Hasil</th></tr></thead>
        <tbody><tr v-for="(l,i) in state.log" :key="i">
          <td class="num">{{ l.ts }}</td><td>{{ l.user }}</td><td>{{ l.aksi }}</td>
          <td><StatusBadge status="ok" /></td>
        </tr></tbody>
      </table></div>
    </section>
  </main>
</template>
<style scoped>
.hydro-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.rows { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0; }
.rows div { display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 6px; }
.rows dt { color: var(--color-text-muted); } .rows dd { margin: 0; font-weight: 700; }
.bar { height: 8px; border-radius: 4px; background: var(--color-bg); overflow: hidden; margin-top: 8px; }
.bar i { display: block; height: 100%; background: var(--color-leaf); }
.act-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.act-grid--single { display: flex; flex-wrap: nowrap; gap: 12px; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 4px; }
.act-grid--single::-webkit-scrollbar { display: none; }
.act-grid--single .act-card { flex: 0 0 300px; }
.act-card { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; min-height: 64px; }
.modes { grid-column: 1 / -1; }
.rule-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.rule-head .h2 { margin: 0; }
.rules { list-style: none; padding: 0; display: grid; gap: 12px; margin: 12px 0 0; }
.rules li { display: flex; gap: 12px; align-items: center; }
.rule-form { display: grid; gap: 12px; margin-top: 16px; }
@media (min-width: 640px) { .hydro-grid { grid-template-columns: 1fr 1fr; gap: 16px; } }
@media (min-width: 1024px) { .hydro-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } .bar { height: 10px; }
  .act-grid--single { overflow: visible; flex-wrap: nowrap; }
  .act-grid--single .act-card { flex: 1 1 0; min-width: 0; }
  .act-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .rule-form { grid-template-columns: 1fr 1fr auto; align-items: end; } }
</style>
