<template>
  <div class="numeric-keypad w-full max-w-xs mx-auto bg-gray-50 rounded-xl p-4 shadow-inner">
    <!-- Display con botón de borrado -->{{ props.currentStep }} {{ disabledAction }}
    <div class="flex mb-4 h-16 border-b border-gray-400 items-center">
      <div class="flex-grow flex items-center justify-between px-4 text-3xl font-mono">
        <p>{{ typeLabel }}</p>
        <p>{{ formattedDisplay }}</p>
      </div>
      <button
        @click="handleBackspace"
        class="hover:bg-red-50 hover:text-red-500 text-gray-500 w-13 h-13 rounded-full flex items-center justify-center transition-colors duration-200 active:bg-red-100"
      >
        <span class="text-2xl">⌫</span>
      </button>
    </div>

    <!-- Teclado numérico -->
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="btn in buttonConfig"
        :key="btn.value"
        @click="handleButtonPress(btn.value)"
        class="h-14 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xl font-medium flex items-center justify-center transition-all duration-200 active:scale-95"
        :class="{
          [actionButtonClass]: btn.value === 'action',
          'opacity-50 cursor-not-allowed': btn.value === 'action' && disabledAction,
        }"
      >
        {{ btn.value === 'action' ? '✔' : btn.value }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ActiveStep } from '@/types'
import { useTipsStore } from '@/stores/tipsStore'

interface ButtonConfig {
  value: string
  label: string
}

interface Props {
  modelValue: number
  actionLabel?: string
  typeLabel?: string
  actionButtonClass?: string
  disabledAction?: boolean
  currentStep?: ActiveStep
  paymentMethod?: string
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'action'): void
}

const tipsStore = useTipsStore()

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  actionLabel: 'Continuar',
  typeLabel: '$',
  actionButtonClass: 'text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800',
  disabledAction: false,
  currentStep: 'amount',
})

const emit = defineEmits<Emits>()

const buttonConfig: ButtonConfig[] = [
  '7',
  '8',
  '9',
  '4',
  '5',
  '6',
  '1',
  '2',
  '3',
  '00',
  '0',
  'action',
].map((value) => ({
  value,
  label: value === 'action' ? props.actionLabel : value,
}))

const inputValue = ref(props.modelValue.toString())

const formattedDisplay = computed(() => {
  const num = parseFloat(inputValue.value) || 0
  return num.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

/**
 * Maneja el evento de pulsación de botón
 * @param value - Valor del botón pulsado
 */
const handleButtonPress = (value: string) => {
  if (value === 'action') {
    if (!props.disabledAction) {
      emit('action')
      handleActionStep()
    }
    return
  }

  if (value === '.') {
    if (!inputValue.value.includes('.')) {
      inputValue.value += value
    }
  } else {
    inputValue.value = inputValue.value === '0' ? value : inputValue.value + value
  }

  updateModelValue()
}

/**
 * Maneja la lógica de acción según el paso actual
 */
const handleActionStep = () => {
  const numericValue = parseFloat(inputValue.value) || 0

  switch (props.currentStep) {
    case 'amount':
      tipsStore.setTotalTips(numericValue)
      tipsStore.setActiveStep('split')
      break
    case 'split':
      tipsStore.setSplitCount(numericValue)
      tipsStore.setActiveStep('payment')
      break
    case 'payment':
      console.log('add payment')
      tipsStore.addPayment(numericValue, props.paymentMethod || 'Efectivo')
      break
  }
}

/**
 * Maneja el borrado de dígitos
 */
const handleBackspace = () => {
  inputValue.value = inputValue.value.length > 1 ? inputValue.value.slice(0, -1) : '0'
  updateModelValue()
}

/**
 * Actualiza el valor del modelo
 */
const updateModelValue = () => {
  const numValue = parseFloat(inputValue.value) || 0
  emit('update:modelValue', numValue)
}

/**
 * Sincroniza con cambios externos
 */
watch(
  () => props.modelValue,
  (newVal) => {
    const newValueStr = newVal.toString()
    if (newValueStr !== inputValue.value) {
      inputValue.value = newValueStr
    }
  },
)
</script>
