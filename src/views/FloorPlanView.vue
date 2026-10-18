<script setup>
import { ref } from 'vue'
import FloorPlan from '../components/greenhouse/FloorPlan.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
const layers = ref(['fish', 'hydro', 'climate', 'energy'])
const sel = ref(null)
const all = [['fish','Ikan'],['hydro','Hidroponik'],['climate','Iklim'],['energy','Energi']]
function toggle(l) { layers.value = layers.value.includes(l) ? layers.value.filter(x => x !== l) : [...layers.value, l] }
</script>
<template>
  <main class="page">
    <div class="chip-row" role="group" aria-label="Toggle layer">
      <button v-for="[v,l] in all" :key="v" class="chip" :aria-pressed="layers.includes(v)" @click="toggle(v)">{{ l }}</button>
    </div>
    <section class="grid-2 plan-grid">
      <div class="card"><FloorPlan :layers="layers" @select="sel = $event" /></div>
      <aside class="card detail" aria-live="polite">
        <h2 class="h2">Detail sensor</h2>
        <div v-if="sel">
          <p class="h3">{{ sel.label }}</p>
          <p>{{ sel.val }}</p>
          <StatusBadge :status="sel.s" />
        </div>
        <p v-else class="muted">Ketuk pin di denah untuk melihat nilai sensor.</p>
        <h3 class="h3" style="margin-top:16px">Legenda</h3>
        <ul class="legend">
          <li><i class="ok"></i>Normal</li><li><i class="warn"></i>Warning</li>
          <li><i class="crit"></i>Critical</li><li><i class="off"></i>Offline</li>
        </ul>
      </aside>
    </section>
  </main>
</template>
<style scoped>
.plan-grid { grid-template-columns: 1fr; }
.legend { list-style: none; display: flex; gap: 12px; padding: 0; margin: 8px 0 0; flex-wrap: wrap; font-size: 13px; }
.legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
.ok { background: var(--color-ok); } .warn { background: var(--color-warn); } .crit { background: var(--color-danger); } .off { background: var(--color-offline); }
@media (min-width: 1024px) { .plan-grid { grid-template-columns: 8fr 4fr; } .legend { flex-direction: column; } }
</style>
