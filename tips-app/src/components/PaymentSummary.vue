<template>
  <div class="p-4 bg-gray-50 rounded-lg mb-4">
    <div class="grid grid-cols-2 gap-y-2 mb-3">
      <div class="font-semibold">Total Pagado:</div>
      <div class="text-right">${{ totalPaid.toFixed(2) }}</div>
      <div class="font-semibold">Restante por Pagar:</div>
      <div class="text-right">${{ remainingAmount.toFixed(2) }}</div>
    </div>

    <div class="border-t pt-3">
      <h3 class="font-semibold mb-2">Pagos</h3>
      <div v-if="payments.length === 0" class="text-gray-500 italic">Sin Pagos</div>
      <ul v-else class="space-y-2">
        <li
          v-for="(payment, index) in payments"
          :key="index"
          class="flex justify-between items-center p-2 bg-white rounded border"
        >
          <span>{{ payment.method }}</span>
          <span class="font-medium">${{ payment.amount.toFixed(2) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  totalAmount: {
    type: Number,
    required: true,
  },
  payments: {
    type: Array as () => Array<{ method: string; amount: number }>,
    required: true,
  },
})

const totalPaid = computed(() => props.payments.reduce((sum, p) => sum + p.amount, 0))

const remainingAmount = computed(() => props.totalAmount - totalPaid.value)
</script>
