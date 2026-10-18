// Status ambang per Bagian 4 design.md
export function statusOf(param, v) {
  const crit = {
    waterTemp: v < 22 || v > 34, ph: v < 5.5 || v > 9.0, do: v < 2,
    nh3: v > 2, no2: v > 2, no3: v > 300, level: v < 35,
  }
  const warn = {
    waterTemp: v < 24 || v > 32, ph: v < 6.2 || v > 8.5, do: v < 3,
    nh3: v > 1, no2: v > 1, no3: v > 200, level: v < 45,
  }
  if (crit[param]) return 'critical'
  if (warn[param]) return 'warning'
  return 'ok'
}
export const statusLabel = { ok: 'Normal', warning: 'Warning', critical: 'Critical', offline: 'Offline' }
