<template>
  <div class="history-view">
    <h1>Historial de Turnos</h1>

    <div v-if="shifts.length === 0" class="empty-state">No hay turnos registrados</div>

    <div v-else class="shift-list">
      <div v-for="shift in shifts" :key="shift.id" class="shift-card">
        <div class="shift-header">
          <h3>Turno #{{ shift.id.slice(-4) }}</h3>
          <span class="shift-date">
            {{ formatDate(shift.startTime) }}
            <span v-if="shift.endTime"> - {{ formatDate(shift.endTime) }}</span>
          </span>
        </div>

        <div class="shift-details">
          <div class="detail">
            <span>Total Propinas:</span>
            <span>${{ shift.totalTips.toFixed(2) }}</span>
          </div>

          <div class="detail">
            <span>Total Pagado:</span>
            <span>${{ getTotalPaid(shift).toFixed(2) }}</span>
          </div>
        </div>

        <TransactionList :transactions="shift.payments" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTipsStore } from '@/stores/tipsStore'
import TransactionList from '@/components/TransactionList.vue'

const tipsStore = useTipsStore()

const shifts = computed(() => tipsStore.filteredShifts)

const getTotalPaid = (shift: any) => {
  return shift.payments.reduce((sum: number, p: any) => sum + p.amount, 0)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.history-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.shift-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shift-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.shift-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.shift-date {
  color: #666;
  font-size: 0.9rem;
}

.shift-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
}

.detail span:first-child {
  font-weight: 500;
}
</style>
