<template>
  <h1 class="text-2xl font-bold text-gray-800 mb-6">Pago de Propinas</h1>
  <div class="pos-container bg-white p-6 mx-auto grid grid-cols-3">
    <!-- Título principal -->

    <!-- Sección 2: División de propinas -->
    <div class="bg-white p-4 rounded-lg">
      <TipSplitter
        :total-tips="tipsStore.currentShift?.totalTips || 0"
        :total-people="tipsStore.currentShift?.splitCount || 1"
      />
      <!-- <h2 class="text-lg font-semibold mb-3">¿Entre cuántos quieres dividir las Propinas?</h2>
      <div class="flex items-center gap-4 mb-4">
        <input v-model.number="splitCount" type="number" min="1" class="w-20 p-2 border rounded" />
        <span class="text-xl font-medium">${{ amountPerPerson }} x Persona</span>
      </div> -->
      <!-- Sección 3: Método de pago -->
      <h2 class="text-lg font-semibold mb-3">Elige el Método de Pago</h2>
      <div class="bg-white p-4 rounded-lg mt-16">
        <PaymentMethod :amount="paymentAmount" v-model="selectedPaymentMethod" />
      </div>
    </div>

    <!-- Sección 1: Total de propinas -->
    <div class="bg-white p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-3">Total de Propinas</h2>
      <div class="text-3xl font-bold">${{ totalTips }}</div>

      <!-- NumericKeypad para ingresar el total -->
      <NumericKeypad
        v-if="tipsStore.activeStep === 'amount'"
        v-model="totalTips"
        class="mt-4"
        current-step="amount"
      />
      <NumericKeypad
        v-if="tipsStore.activeStep === 'split'"
        v-model="splitCount"
        type-label="#"
        action-label="Agregar Pago"
        current-step="split"
        class="flex-1"
      />
      <NumericKeypad
        v-if="tipsStore.activeStep === 'payment'"
        v-model="paymentAmount"
        action-label="Agregar Pago"
        current-step="payment"
        :payment-method="selectedPaymentMethod"
        class="flex-1"
      />

      <!-- <div class="bg-white p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-3">Pagar Propinas</h2>
        <div class="flex flex-col sm:flex-row gap-4"></div>
      </div> -->
    </div>

    <!-- Sección 5: Lista de pagos -->
    <div class="bg-white p-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-3">Pagos</h2>
      <div v-if="payments.length === 0" class="text-gray-500">Sin Pagos</div>
      <ul v-else class="divide-y">
        <li
          v-for="(payment, index) in payments"
          :key="index"
          class="flex items-center p-3 rounded-lg hover:bg-gray-50 shadow mb-3 cursor-pointer transition-colors duration-200 justify-start"
        >
          {{ payment.method }} - ${{ payment.amount }}
        </li>
      </ul>
    </div>

    <!-- Sección 4: Resumen y pagos -->
    <div class="mb-6 items-center bg-white flex justify-center col-span-3">
      <div class="space-y-2 w-1/3 mx-5 text-3xl">
        <div class="flex justify-between">
          <h3 class="font-semibold mb-2 text-orange-600">Total Pagado</h3>
          <p class="text-3xl font-bold text-orange-600">${{ totalPaid }}</p>
        </div>
        <div class="flex justify-between">
          <h3 class="font-semibold mb-2">Restante por Pagar</h3>
          <p class="text-3xl font-bold">${{ remaining }}</p>
        </div>
      </div>

      <button
        @click="closeShift"
        :disabled="remaining > 0 || tipsStore.activeStep !== 'payment'"
        class="w-1/3 mx-5 bg-orange-600 hover:bg-orange-700 text-xl font-bold text-white px-6 h-15 text-center content-center disabled:text-gray-400 disabled:bg-white disabled:border-2 disabled:border-gray-400 rounded-full"
      >
        {{ remaining === 0 ? '$' + totalPaid : '' }} Pagar Propinas
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTipsStore } from '@/stores/tipsStore'
import NumericKeypad from '@/components/NumericKeypad.vue'
import PaymentMethod from '@/components/PaymentMethod.vue'
import TipSplitter from '@/components/TipSplitter.vue'

const tipsStore = useTipsStore()

// Iniciar nuevo turno si no hay uno activo
if (!tipsStore.currentShift) {
  tipsStore.startNewShift()
}

const selectedPaymentMethod = ref(tipsStore.paymentMethods[0])
const paymentAmount = ref(0)

// Computed properties
const activeStep = computed(() => tipsStore.currentStep)
const splitCount = computed({
  get: () => tipsStore.currentShift?.splitCount || 1,
  set: (value) => tipsStore.setSplitCount(value),
})
const payments = computed(() => tipsStore.currentShift?.payments || [])
const totalPaid = computed(() => payments.value.reduce((sum, p) => sum + p.amount, 0))
const remaining = computed(() => (tipsStore.currentShift?.totalTips || 0) - totalPaid.value)

/**
 * Añade un pago al turno actual
 */
// const addPayment = () => {
//   // Validación adicional
//   if (paymentAmount.value <= 0 || remaining.value <= 0) {
//     return
//   }

//   // Solo permitir un pago a la vez
//   if (
//     tipsStore.currentShift?.payments.some(
//       (p) =>
//         p.amount === paymentAmount.value &&
//         p.method === selectedPaymentMethod.value &&
//         new Date().getTime() - p.timestamp.getTime() < 1000,
//     )
//   ) {
//     return
//   }

//   tipsStore.addPayment(paymentAmount.value, selectedPaymentMethod.value)

//   // Resetear después del pago
//   paymentAmount.value = 0
// }

/**
 * Cierra el turno actual
 */
const closeShift = () => {
  if (remaining.value > 0) return
  tipsStore.setActiveStep('close')
  tipsStore.setActiveStep('amount')
  tipsStore.closeCurrentShift()
}
</script>
