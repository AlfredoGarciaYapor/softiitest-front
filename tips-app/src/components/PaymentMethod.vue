<template>
  <div class="bg-white p-4 rounded-lg">
    <!-- <h2 class="text-xl font-bold text-gray-800 mb-4">Método de Pago</h2> -->

    <div class="mb-6">
      <!-- <label class="block text-gray-700 mb-3">Seleccione método:</label> -->

      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="method in paymentMethods"
          :key="method"
          class="flex items-center p-3 border rounded-lg hover:bg-gray-50 shadow cursor-pointer transition-colors duration-200 justify-start"
          :class="{
            'border-orange-500 bg-orange-50': selectedMethod === method,
          }"
        >
          <input
            type="radio"
            v-model="selectedMethod"
            :value="method"
            class="h-5 w-5 text-orange-600 mr-3 focus:ring-orange-500 appearance-none"
          />
          <span class="text-normal">{{ method }}</span>
        </label>
      </div>
    </div>

    <div class="bg-gray-100 p-4 rounded-lg">
      <p class="text-gray-600 text-center mb-1">Monto a pagar:</p>
      <p class="text-2xl font-bold text-center">${{ formattedAmount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PMethod } from '@/types'

interface Props {
  amount: number
  paymentMethods?: PMethod[]
  modelValue?: PMethod
}

const props = withDefaults(defineProps<Props>(), {
  paymentMethods: () => ['Efectivo', 'BBVA 1234', 'Santander 1234'],
  modelValue: 'Efectivo'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: PMethod): void
}>()

const selectedMethod = ref<PMethod>(props.modelValue)

// Watchers para sincronización bidireccional
watch(selectedMethod, (newVal) => {
  emit('update:modelValue', newVal)
})

watch(() => props.modelValue, (newVal) => {
  selectedMethod.value = newVal
})
</script>