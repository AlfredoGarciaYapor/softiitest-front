/**
 * Tipos principales para la aplicación de gestión de propinas
 */

export type ActiveStep = 'amount' | 'split' | 'payment' | 'closed'

export interface Employee {
  id: string
  name: string
  role: 'waitress' | 'chef' | 'manager' // Roles específicos
}

export interface Payment {
  id: string
  amount: number
  method: string
  employeeId?: string
  timestamp: Date
}

export interface Tip {
  id: string
  amount: number
  splitCount: number
  payments: Payment[]
  timestamp: Date
}

export interface Shift {
  id: string
  startTime: Date
  endTime?: Date
  totalTips: number
  tips: Tip[] // Add the 'tips' property
  isClosed: boolean
}

/**
 * Tipos de utilidad
 */
export type PMethod = 'Efectivo' | 'BBVA 1234' | 'Santander 1234' | string
