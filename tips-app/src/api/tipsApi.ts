import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export default {
  // Turnos
  async createShift() {
    const response = await api.post('/shifts');
    return response.data;
  },

  async getCurrentShift() {
    const response = await api.get('/shifts/current');
    return response.data;
  },

  async closeShift(shiftId: string) {
    const response = await api.put(`/shifts/${shiftId}/close`);
    return response.data;
  },

  // Propinas
  async addTip(shiftId: string, amount: number, splitCount: number) {
    const response = await api.post(`/tips/${shiftId}`, { 
      amount, 
      splitCount,
    });
    return response.data;
  },

  async getTips(shiftId: string) {
    const response = await api.get(`/tips/${shiftId}`);
    return response.data;
  },

  // Pagos
  async addPayment(tipId: string, amount: number, method: string) {
    const response = await api.post(`/tips/${tipId}/payments`, {
      amount,
      method
    });
    return response.data;
  },

  async getPayments(tipId: string) {
    const response = await api.get(`/tips/${tipId}/payments`);
    return response.data;
  },

  // Recibos
  async generateReceipt(shiftId: string) {
    const response = await api.get(`/receipts/${shiftId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};