<script setup>
import { state } from '../../stores/sensors.js'
import StatusBadge from './StatusBadge.vue'
</script>
<template>
  <div class="banner card" role="status">
    <div>
      <p class="caption">Status Sistem</p>
      <p class="b-title">{{ state.systemStatus === 'warning' ? 'Perlu Perhatian' : 'Semua Normal' }}</p>
      <p class="caption">2 warning aktif: pH kolam kiri, suhu udara</p>
    </div>
    <StatusBadge :status="state.systemStatus" />
  </div>
</template>
<style scoped>
.banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding-block: 10px; border-left: 4px solid var(--color-warn); }
.b-title { margin: 0; font-size: 14px; font-weight: 700; color: var(--color-primary); }
@media (min-width: 640px) { .banner { min-height: 52px; } }
@media (min-width: 1024px) { .banner { min-height: 56px; } .b-title { font-size: 16px; } }
</style>
