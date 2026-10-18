<script setup>
defineProps({ levelCm: Number, maxCm: { type: Number, default: 70 } })
</script>
<template>
  <div class="pond-sec" role="img" :aria-label="`Level air ${levelCm} cm dari ${maxCm} cm`">
    <div class="tank"><div class="water" :style="{ height: `${(levelCm/maxCm)*100}%` }"></div></div>
    <p class="num lvl">{{ levelCm }}<span> cm</span></p>
    <p class="caption">Kedalaman kolam 0–{{ maxCm }} cm</p>
  </div>
</template>
<style scoped>
.pond-sec { display: grid; justify-items: center; gap: 8px; }
.tank { width: 120px; height: 180px; border: 2px solid var(--color-water); border-radius: 0 0 12px 12px; position: relative; overflow: hidden; background: var(--color-surface); }
.water { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(14,90,107,.45); transition: height 400ms var(--ease-out); }
.lvl { font-size: 24px; font-weight: 700; margin: 0; color: var(--color-primary); }
.lvl span { font-size: 12px; color: var(--color-text-muted); font-weight: 500; }
@media (min-width: 1024px) { .tank { width: 160px; height: 280px; } }
</style>
