<script setup>
import { ref, computed } from 'vue'
import { state, ackAlert } from '../stores/sensors.js'
import StatusBadge from '../components/ui/StatusBadge.vue'
const f = ref('semua')
const list = computed(() => f.value === 'semua' ? state.alerts : state.alerts.filter(a => a.severity === f.value))
</script>
<template>
  <main class="page">
    <div class="chip-row" role="group" aria-label="Filter severity">
      <button v-for="o in [['semua','Semua'],['warning','Warning'],['critical','Critical'],['ok','Info']]" :key="o[0]" class="chip" :aria-pressed="f===o[0]" @click="f=o[0]">{{ o[1] }}</button>
    </div>
    <section class="card alert-card"><ul class="alerts">
      <li v-if="!list.length" class="muted">Tidak ada alert pada filter ini.</li>
      <li v-for="a in list" :key="a.id">
        <StatusBadge :status="a.severity" />
        <div class="alert-body"><p class="msg">{{ a.message }}</p><p class="caption">{{ a.source }} · {{ a.ts }} · {{ a.ack ? 'Selesai' : 'Aktif' }}</p></div>
        <button v-if="!a.ack" class="btn btn-secondary" @click="ackAlert(a.id)">Tandai selesai</button>
      </li>
    </ul></section>
  </main>
</template>
<style scoped>
.alerts { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.alerts li { display: flex; gap: 12px; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; min-width: 0; flex-wrap: nowrap; }
.alerts li:last-child { border-bottom: 0; padding-bottom: 0; }
.alert-body { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.msg { margin: 0; font-weight: 600; }
.alerts .btn { margin-left: auto; flex: 0 0 auto; }
@media (max-width: 639px) {
  .alert-card { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; overscroll-behavior-x: contain; }
  .alert-card::-webkit-scrollbar { display: none; }
  .alert-card .alerts { min-width: max-content; }
  .alert-card .alerts li { white-space: nowrap; }
  .alert-card .msg, .alert-card .caption { white-space: nowrap; }
}
@media (min-width: 640px) {
  .alert-card { overflow: visible; }
  .alert-card .alerts { min-width: 0; }
}
</style>
