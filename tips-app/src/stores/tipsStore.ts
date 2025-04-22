import { defineStore } from 'pinia'
import tipsApi from '@/api/tipsApi'
import { ref, computed } from 'vue'
import type { Shift, Tip, Payment, PMethod, ActiveStep } from '@/types'

export const useTipsStore = defineStore('tips', () => {
  // Estado
  const currentShift = ref<Shift | null>(null)
  const currentTip = ref<Tip | null>(null)
  const activeStep = ref<ActiveStep>('amount')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const paymentMethods = computed<PMethod[]>(() => ['Efectivo', 'BBVA 1234', 'Santander 1234'])
  const totalTips = computed(() => currentTip.value?.amount || 0)
  const totalPaid = computed(() => 
    currentTip.value?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  )
  const remaining = computed(() => Math.max(0, totalTips.value - totalPaid.value))
  const canCloseShift = computed(() => 
    remaining.value <= 0 && 
    activeStep.value === 'payment' && 
    !loading.value &&
    currentShift.value !== null
  )

  // Acciones
  const setTipAmount = (amount: Tip['amount']): void => {
    if (currentTip.value) {
      currentTip.value.amount = amount
    } else {
      throw new Error('No hay propina activa')
    }
  }
  const startNewShift = async (): Promise<void> => {
    try {
      loading.value = true
      currentShift.value = await tipsApi.createShift()
      currentTip.value = null
      activeStep.value = 'amount'
      error.value = null
    } catch (err) {
      error.value = 'Error al iniciar turno'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTip = async (amount: number, splitCount: number): Promise<void> => {
    if (!currentShift.value) throw new Error('No hay turno activo')
      console.log(currentShift.value)
    
    try {
      loading.value = true
      const newTip = await tipsApi.addTip(
        currentShift.value.id,
        amount,
        splitCount
      )
      currentTip.value = newTip
      
      // Agregar la propina al turno actual
      if (currentShift.value.tips) {
        currentShift.value.tips.push(newTip)
      } else {
        currentShift.value.tips = [newTip]
      }
      
      currentShift.value.totalTips = amount
      activeStep.value = 'split'
      error.value = null
    } catch (err) {
      error.value = 'Error al crear propina'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addPayment = async (amount: number, method: PMethod): Promise<void> => {
    if (!currentTip.value || !currentShift.value) {
      throw new Error('No hay propina o turno activo')
    }
    
    try {
      loading.value = true
      const payment = await tipsApi.addPayment(
        currentTip.value.id,
        amount,
        method
      )
      
      // Actualizar pagos en la propina actual
      currentTip.value.payments.push(payment)
      
      // Actualizar en el turno
      const tipInShift = currentShift.value.tips.find(t => t.id === currentTip.value?.id)
      if (tipInShift) {
        tipInShift.payments.push(payment)
      }
      
      error.value = null
    } catch (err) {
      error.value = 'Error al agregar pago'
      throw err
    } finally {
      loading.value = false
    }
  }

  const closeShift = async (): Promise<void> => {
    if (!currentShift.value || !canCloseShift.value) return
    
    try {
      loading.value = true
      currentShift.value = await tipsApi.closeShift(currentShift.value.id)
      if (currentShift.value) {
        currentShift.value.isClosed = true
        currentShift.value.endTime = new Date()
      }
      activeStep.value = 'closed'
      error.value = null
    } catch (err) {
      error.value = 'Error al cerrar turno'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    currentShift,
    currentTip,
    activeStep,
    loading,
    error,
    
    // Getters
    paymentMethods,
    totalTips,
    totalPaid,
    remaining,
    canCloseShift,
    
    // Acciones
    setTipAmount,
    startNewShift,
    createTip,
    addPayment,
    closeShift,
    setActiveStep: (step: ActiveStep) => { activeStep.value = step },
    setSplitCount: (count: number) => {
      if (currentTip.value) {
        currentTip.value.splitCount = count
      }
    }
  }
})