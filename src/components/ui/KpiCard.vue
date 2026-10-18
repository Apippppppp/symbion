<script setup>
import StatusBadge from './StatusBadge.vue'
import AppIcon from './AppIcon.vue'
defineProps({ label: String, value: [Number, String], unit: String, status: { type: String, default: 'ok' }, icon: { type: String, default: 'overview' }, trend: { type: String, default: '' }, variant: { type: String, default: '' } })
</script>
<template>
  <article class="kpi card" :class="variant === 'banner' ? 'kpi--banner' : ''">
    <!-- banner: horizontal ramping (Suhu Udara) -->
    <template v-if="variant === 'banner'">
      <span class="kpi-tile" :data-s="status" aria-hidden="true"><AppIcon :name="icon" :size="18" /></span>
      <div class="kpi-body">
        <p class="kpi-label">{{ label }}</p>
        <p class="kpi-value num">{{ value }}<span class="kpi-unit">{{ unit }}</span></p>
      </div>
      <div class="kpi-foot">
        <StatusBadge :status="status" />
        <span v-if="trend" class="kpi-trend num caption">{{ trend }}</span>
      </div>
    </template>
    <!-- default: vertikal seperti sebelumnya -->
    <template v-else>
      <div class="kpi-head">
        <span class="kpi-tile" :data-s="status" aria-hidden="true"><AppIcon :name="icon" :size="20" /></span>
        <p class="kpi-label">{{ label }}</p>
      </div>
      <p class="kpi-value num">{{ value }}<span class="kpi-unit">{{ unit }}</span></p>
      <div class="kpi-foot--col">
        <StatusBadge :status="status" />
        <span v-if="trend" class="kpi-trend num caption">{{ trend }}</span>
      </div>
    </template>
  </article>
</template>
<style scoped>
.kpi { display: flex; flex-direction: column; gap: 10px; min-height: 118px; }
.kpi-head { display: flex; align-items: center; gap: 10px; min-width: 0; }
.kpi-tile { width: 36px; height: 36px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; background: color-mix(in srgb, var(--color-accent-green) 12%, var(--color-surface)); color: var(--color-accent-green); }
.kpi-tile[data-s="warning"] { background: color-mix(in srgb, var(--color-danger) 14%, var(--color-surface)); color: var(--color-danger); }
.kpi-tile[data-s="critical"] { background: color-mix(in srgb, var(--color-danger) 14%, var(--color-surface)); color: var(--color-danger); }
.kpi-tile[data-s="offline"] { background: var(--color-bg); color: var(--color-text-muted); }
.kpi-label { font-size: 12px; line-height: 16px; color: var(--color-text-muted); margin: 0; font-weight: 500; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.kpi-value { font-size: 28px; line-height: 32px; font-weight: 700; margin: 0; color: var(--color-primary); letter-spacing: -0.02em; }
.kpi-unit { font-size: 12px; line-height: 16px; font-weight: 500; color: var(--color-text-muted); margin-left: 4px; letter-spacing: 0; }
.kpi-foot--col { display: flex; align-items: center; gap: 8px; margin-top: auto; }
.kpi--banner { flex-direction: row; align-items: center; gap: 12px; min-height: 56px; padding-block: 10px; }
.kpi--banner .kpi-tile { width: 38px; height: 38px; }
.kpi--banner .kpi-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1 1 auto; }
.kpi--banner .kpi-label { font-size: 11px; line-height: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: unset; }
.kpi--banner .kpi-value { font-size: 18px; line-height: 20px; }
.kpi--banner .kpi-unit { font-size: 11px; }
.kpi--banner .kpi-foot { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex: 0 0 auto; }
.kpi--banner .kpi-trend { max-width: 120px; text-align: right; }
@media (min-width: 1024px) {
  .kpi { min-height: 132px; }
  .kpi-tile { width: 40px; height: 40px; }
  .kpi-label { font-size: 13px; }
  .kpi-value { font-size: 34px; line-height: 40px; }
  .kpi-unit { font-size: 13px; }
  .kpi--banner { min-height: 60px; gap: 14px; }
  .kpi--banner .kpi-value { font-size: 20px; line-height: 22px; }
}
</style>
