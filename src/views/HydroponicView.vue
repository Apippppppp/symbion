<script setup>
import { state } from '../stores/sensors.js'
const target = 38
const pct = (age) => Math.min(100, Math.round((age / target) * 100))
</script>
<template>
  <main class="page">
    <section class="hydro-grid" aria-label="Empat paralon">
      <article v-for="(h, id) in state.hydro" :key="id" class="card">
        <h2 class="h3">{{ id.replace('_', ' ') }}</h2>
        <dl class="rows">
          <div><dt>pH</dt><dd class="num">{{ h.ph }}</dd></div>
          <div><dt>EC</dt><dd class="num">{{ h.ec }} mS/cm</dd></div>
          <div><dt>Suhu</dt><dd class="num">{{ h.temp }}°C</dd></div>
          <div><dt>Aliran</dt><dd class="num">{{ h.flow }} L/mnt</dd></div>
        </dl>
        <p class="caption">Umur {{ h.ageDay }} hari dari target {{ target }} hari</p>
        <div class="bar" role="progressbar" :aria-valuenow="pct(h.ageDay)" aria-valuemin="0" aria-valuemax="100" :aria-label="`Siklus tanam ${id}`">
          <i :style="{ width: pct(h.ageDay) + '%' }"></i>
        </div>
      </article>
    </section>
    <section class="card"><h2 class="h2">Catatan nutrisi</h2>
      <p class="muted">EC ideal 0,8–1,5 mS/cm, pH 5,8–6,5. Cek larutan tiap pagi, bilas paralon tiap panen.</p>
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
@media (min-width: 640px) { .hydro-grid { grid-template-columns: 1fr 1fr; gap: 16px; } }
@media (min-width: 1024px) { .hydro-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } .bar { height: 10px; } }
</style>
