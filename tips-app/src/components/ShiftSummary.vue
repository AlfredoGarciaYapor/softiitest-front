<template>
  <div class="bg-white rounded-lg shadow p-6 mt-6">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Resumen del Turno</h3>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-50 p-3 rounded-lg">
        <p class="text-gray-600 text-sm">Total Propinas</p>
        <p class="text-xl font-bold">${{ shift.totalTips.toFixed(2) }}</p>
      </div>

      <div class="bg-gray-50 p-3 rounded-lg">
        <p class="text-gray-600 text-sm">Total Pagado</p>
        <p class="text-xl font-bold">${{ totalPaid.toFixed(2) }}</p>
      </div>

      <div class="bg-gray-50 p-3 rounded-lg col-span-2">
        <p class="text-gray-600 text-sm">Restante por Pagar</p>
        <p class="text-xl font-bold" :class="remaining > 0 ? 'text-red-600' : 'text-green-600'">
          ${{ remaining.toFixed(2) }}
        </p>
      </div>
    </div>

    <button
      @click="$emit('close-shift')"
      :disabled="remaining > 0"
      class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Cerrar Turno
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  shift: {
    type: Object,
    required: true,
  },
})

const totalPaid = computed(() => {
  return props.shift.payments.reduce((sum: number, p: any) => sum + p.amount, 0)
})

const remaining = computed(() => {
  return props.shift.totalTips - totalPaid.value
})
</script>
