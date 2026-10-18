// Mock data terpusat. ponytail: ganti dengan fetch WebSocket/MQTT, bentuk objek tetap.
import { reactive, computed } from 'vue'

export const state = reactive({
  systemStatus: 'warning',
  ponds: {
    POND_L: { name: 'Kolam Kiri', temp: 31.2, ph: 8.3, do: 3.4, nh3: 0.7, no2: 0.3, no3: 120, levelCm: 52 },
    POND_R: { name: 'Kolam Kanan', temp: 28.4, ph: 7.1, do: 5.2, nh3: 0.2, no2: 0.1, no3: 60, levelCm: 62 },
  },
  hydro: {
    HYDRO_L1: { ph: 6.1, ec: 1.2, temp: 22.0, flow: 3.5, ageDay: 18 },
    HYDRO_L2: { ph: 6.3, ec: 1.1, temp: 22.4, flow: 3.4, ageDay: 18 },
    HYDRO_R1: { ph: 6.0, ec: 1.3, temp: 21.8, flow: 3.6, ageDay: 25 },
    HYDRO_R2: { ph: 6.2, ec: 1.2, temp: 22.1, flow: 3.5, ageDay: 25 },
  },
  climate: { airTemp: 31.5, humidity: 68, lux: 28000, fanOn: true },
  energy: { solarW: 820, loadW: 340, soc: 76, todayKWh: 4.8 },
  actuators: [
    { id: 'PUMP_1', name: 'Pompa sirkulasi', mode: 'auto', on: true },
    { id: 'AERATOR_1', name: 'Aerator kolam', mode: 'auto', on: true },
    { id: 'FAN_1', name: 'Exhaust fan', mode: 'auto', on: true },
    { id: 'FILL_1', name: 'Pompa pengisi air', mode: 'auto', on: false },
  ],
  alerts: [
    { id: 'A001', severity: 'warning', source: 'POND_L', message: 'pH kolam kiri 8,3 mendekati batas atas', ts: '10:24', ack: false },
    { id: 'A002', severity: 'warning', source: 'Iklim', message: 'Suhu udara 31,5°C, fan menyala otomatis', ts: '10:11', ack: false },
    { id: 'A003', severity: 'ok', source: 'Energi', message: 'Baterai 76%, produksi surya normal', ts: '09:40', ack: true },
  ],
  rules: [
    { id: 'R1', on: true, text: 'Jika DO < 3 mg/L, nyalakan aerator + kirim alert' },
    { id: 'R2', on: true, text: 'Jika suhu udara > 30°C, nyalakan exhaust fan' },
    { id: 'R3', on: true, text: 'Jika level air < 45 cm, nyalakan pompa pengisi' },
  ],
  log: [
    { ts: '10:24', user: 'Otomatis', aksi: 'Aerator ON (DO kolam kiri rendah)', hasil: 'OK' },
    { ts: '10:11', user: 'Otomatis', aksi: 'Fan ON (suhu > 30°C)', hasil: 'OK' },
  ],
})

export function toggleActuator(id) {
  const a = state.actuators.find((x) => x.id === id)
  if (a) {
    a.on = !a.on
    state.log.unshift({ ts: 'baru saja', user: 'Operator', aksi: `${a.name} ${a.on ? 'ON' : 'OFF'} manual`, hasil: 'OK' })
  }
}

export function ackAlert(id) {
  const a = state.alerts.find((x) => x.id === id)
  if (a) a.ack = true
}

export const activeAlerts = computed(() => state.alerts.filter((a) => !a.ack))
