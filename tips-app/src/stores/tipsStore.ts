import { defineStore } from 'pinia'
import type { Employee, Payment, Shift, ActiveStep, PaymentMethod } from '@/types'

interface TipsState {
  activeStep: ActiveStep
  currentShift: Shift | null
  shifts: Shift[]
  employees: Employee[]
  paymentMethods: PaymentMethod[]
}

/**
 * Store para la gestión de propinas y turnos
 */
export const useTipsStore = defineStore('tips', {
  state: (): TipsState => ({
    activeStep: 'amount',
    currentShift: null,
    shifts: [],
    employees: [
      { id: '1', name: 'Mesero 1', role: 'waitress' },
      { id: '2', name: 'Mesero 2', role: 'waitress' },
      { id: '3', name: 'Cocinero', role: 'chef' },
    ],
    paymentMethods: ['Efectivo', 'BBVA 1234', 'Santander 1234'],
  }),

  actions: {
    /**
     * Inicia un nuevo turno
     */
    startNewShift(): void {
      const newShift: Shift = {
        id: Date.now().toString(),
        startTime: new Date(),
        totalTips: 0,
        splitCount: 1,
        payments: [],
        isClosed: false,
      }
      this.currentShift = newShift
      this.shifts.unshift(newShift)
    },

    /**
     * Establece el total de propinas para el turno actual
     * @param amount - Cantidad de propinas
     */
    setTotalTips(amount: number): void {
      if (!this.currentShift) return
      this.currentShift.totalTips = amount
    },

    /**
     * Establece el número de divisiones para las propinas
     * @param count - Número de divisiones (mínimo 1)
     */
    setSplitCount(count: number): void {
      if (!this.currentShift) return
      this.currentShift.splitCount = Math.max(1, count)
    },

    /**
     * Cambia el paso activo del flujo
     * @param step - Paso al que cambiar
     */
    setActiveStep(step: ActiveStep): void {
      this.activeStep = step
    },

    /**
     * Añade un pago al turno actual
     * @param amount - Cantidad del pago
     * @param method - Método de pago
     * @param employeeId - ID del empleado (opcional)
     */
    addPayment(amount: number, method: string, employeeId?: string): void {
      if (!this.currentShift) return

      const payment: Payment = {
        id: Date.now().toString(),
        amount,
        method,
        employeeId,
        timestamp: new Date(),
      }

      this.currentShift.payments.push(payment)
    },

    /**
     * Cierra el turno actual
     */
    closeCurrentShift(): void {
      if (!this.currentShift) return
      this.currentShift.endTime = new Date()
      this.currentShift.isClosed = true
      this.currentShift = null
      this.activeStep = 'amount'
    },

    /**
     * Obtiene un turno por su ID
     * @param id - ID del turno
     * @returns El turno encontrado o undefined
     */
    getShiftById(id: string): Shift | undefined {
      return this.shifts.find((shift) => shift.id === id)
    },
  },

  getters: {
    /**
     * @returns Total pagado en el turno actual
     */
    currentShiftTotalPaid(): number {
      if (!this.currentShift) return 0
      return this.currentShift.payments.reduce((sum, p) => sum + p.amount, 0)
    },

    /**
     * @returns Paso actual del flujo
     */
    currentStep(): ActiveStep {
      return this.activeStep
    },

    /**
     * @returns Número de divisiones actual
     */
    currentSplitCount(): number {
      if (!this.currentShift) return 0
      return this.currentShift.splitCount
    },

    /**
     * @returns Total de propinas en el turno actual
     */
    currentTotalTips(): number {
      if (!this.currentShift) return 0
      return this.currentShift.totalTips
    },

    /**
     * @returns Cantidad restante por pagar en el turno actual
     */
    currentShiftRemaining(): number {
      if (!this.currentShift) return 0
      return this.currentShift.totalTips - this.currentShiftTotalPaid
    },

    /**
     * @returns Turnos cerrados filtrados
     */
    filteredShifts(): Shift[] {
      return this.shifts.filter((shift) => shift.isClosed)
    },
  },
})
