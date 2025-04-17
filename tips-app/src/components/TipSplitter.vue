<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 mb-4">Dividir Propinas</h2>
    <label class="block text-gray-700 mb-2">¿Entre cuántas personas?</label>
    <!-- <div class="bg-blue-50 p-4 rounded-lg text-center mb-4">
      <p class="text-gray-600">Monto por persona:</p>
      <p class="text-2xl font-bold text-blue-600" v-bind="amountPerPerson">
        ${{ amountPerPerson.toFixed(2) }}
      </p>
    </div> -->
    <div class="flex items-center gap-4 mb-4">
      <input
        type="number"
        min="1"
        class="w-20 p-2 border rounded-lg h-8"
        disabled
        :value="splitCount"
      />
      <span class="text-xl font-bold text-orange-600"
        >${{ amountPerPerson.toFixed(2) }} x Persona</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTipsStore } from '@/stores/tipsStore'

const tipsStore = useTipsStore()

const splitCount = computed(() => {
  return tipsStore.currentShift?.splitCount || 1
})

interface Props {
  totalTips: number
  totalPeople: number
}

// interface Emits {
//   (e: 'update:splitCount', value: number): void
// }

const props = withDefaults(defineProps<Props>(), {
  totalTips: 0,
  totalPeople: 1,
})

// const emit = defineEmits<Emits>()

const amountPerPerson = computed(() => {
  return props.totalTips / props.totalPeople
})
</script>
