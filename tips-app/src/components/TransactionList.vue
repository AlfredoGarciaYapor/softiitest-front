<template>
  <div class="mt-6">
    <h4 class="text-lg font-semibold text-gray-700 mb-3">Transacciones</h4>

    <div
      v-if="transactions.length === 0"
      class="bg-gray-50 p-4 rounded-lg text-center text-gray-500"
    >
      No hay transacciones registradas
    </div>

    <ul v-else class="divide-y divide-gray-200">
      <li v-for="tx in transactions" :key="tx.id" class="py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <div
              class="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3"
            >
              {{ getMethodIcon(tx.method) }}
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ tx.method }}</p>
              <p class="text-sm text-gray-500">{{ formatTime(tx.timestamp) }}</p>
            </div>
          </div>
          <span class="text-lg font-bold text-green-600">${{ tx.amount.toFixed(2) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
})

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getMethodIcon = (method: string) => {
  if (method.includes('BBVA')) return 'BB'
  if (method.includes('Santander')) return 'ST'
  return '$'
}
</script>
