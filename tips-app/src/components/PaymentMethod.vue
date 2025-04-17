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
import { ref, computed, watch } from 'vue'
import type { PaymentMethod } from '@/types'

interface Props {
  /**
   * Monto a pagar
   */
  amount: number

  /**
   * Métodos de pago disponibles
   * @default ['Efectivo', 'BBVA 1234', 'Santander 1234']
   */
  paymentMethods?: PaymentMethod[]
}

interface Emits {
  /**
   * Evento emitido cuando se cambia el método seleccionado
   * @param value - Nuevo método de pago seleccionado
   */
  (e: 'update:modelValue', value: PaymentMethod): void
}

const props = withDefaults(defineProps<Props>(), {
  paymentMethods: () => ['Efectivo', 'BBVA 1234', 'Santander 1234'],
})

const emit = defineEmits<Emits>()

// Método de pago seleccionado
const selectedMethod = ref<PaymentMethod>(props.paymentMethods[0])

// Formatea el monto para mostrar
const formattedAmount = computed(() => {
  return props.amount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

// Emite el cambio cuando se selecciona un nuevo método
watch(selectedMethod, (newMethod) => {
  emit('update:modelValue', newMethod)
})

// Expone el método seleccionado al componente padre
defineExpose({
  selectedMethod,
})
</script>
