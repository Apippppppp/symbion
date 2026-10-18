<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ points: { type: Array, default: () => [26,27,28,29,31,30,29,28] }, label: String, threshold: Number })
const maxV = 40
const active = ref(null)
const tip = computed(() => active.value == null ? null : ({ i: active.value, v: props.points[active.value] }))
function setActive(i) { active.value = i }
function clearActive() { active.value = null }
</script>
<template>
  <figure class="trend" @mouseleave="clearActive" @click.self="clearActive">
    <div class="trend-wrap">
      <svg viewBox="0 0 300 120" preserveAspectRatio="none" role="img" :aria-label="label">
        <g v-for="(p,i) in points" :key="i" class="bar-g" :class="{ on: active===i }" @mouseenter="setActive(i)" @click.stop="setActive(i)" tabindex="0" @focus="setActive(i)" @blur="clearActive">
          <rect
            :x="(i * 300 / points.length) + 6"
            :y="120 - (Math.min(p,maxV)/maxV)*96"
            :width="Math.max(8, 300/points.length - 12)"
            :height="(Math.min(p,maxV)/maxV)*96"
            rx="4" class="bar" />
          <rect
            :x="(i * 300 / points.length)"
            y="0" :width="300/points.length" height="120" class="bar-hit" />
        </g>
        <line v-if="threshold" x1="0" x2="300" :y1="120 - (Math.min(threshold,maxV)/maxV)*96" :y2="120 - (Math.min(threshold,maxV)/maxV)*96" class="th" />
      </svg>
      <div v-if="tip" class="tip" :style="{ left: `calc(${(tip.i * 300 / points.length + 300/points.length/2) / 300 * 100}% - 56px)` }">
        <span class="tip-k">Bar {{ tip.i + 1 }}</span>
        <span class="tip-v num">{{ tip.v }}</span>
      </div>
    </div>
    <figcaption class="caption">{{ label }}</figcaption>
  </figure>
</template>
<style scoped>
.trend { margin: 0; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; scrollbar-width: none; overscroll-behavior-x: contain; max-width: 100%; }
.trend::-webkit-scrollbar { display: none; }
.trend-wrap { position: relative; }
.trend svg { min-width: 560px; height: 180px; display: block; }
.trend figcaption { white-space: nowrap; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; overscroll-behavior-x: contain; padding-bottom: 2px; }
.trend figcaption::-webkit-scrollbar { display: none; }
.bar { fill: #000675; transition: fill 160ms var(--ease-out), opacity 160ms var(--ease-out); }
.bar-g { cursor: pointer; }
.bar-g:focus { outline: none; }
.bar-hit { fill: transparent; }
.bar-g:hover .bar, .bar-g.on .bar, .bar-g:focus .bar { fill: #000675; }
.bar-g.on .bar { filter: brightness(1.05); }
.th { stroke: var(--color-danger); stroke-dasharray: 6 4; stroke-width: 1.5; }
.tip {
  position: absolute; bottom: calc(100% + 8px);
  width: 112px; padding: 8px 10px; border-radius: 10px;
  background: #000675; color: #fff;
  box-shadow: 0 8px 24px rgba(4,4,74,0.22);
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  font-size: 12px; line-height: 14px;
  pointer-events: none;
  z-index: 2;
}
.tip::after { content: ''; position: absolute; left: 50%; top: 100%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: #000675; }
.tip-k { opacity: 0.9; font-weight: 600; white-space: nowrap; }
.tip-v { font-weight: 800; }
@media (min-width: 640px) {
  .trend { overflow: visible; }
  .trend svg { min-width: 0; width: 100%; height: 260px; }
  .trend figcaption { white-space: normal; overflow: visible; }
  .tip { width: 124px; }
}
@media (min-width: 1024px) { .trend svg { height: 320px; } }
</style>
