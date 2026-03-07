import axios from 'axios';

export interface MoMoPaymentRequest {
  amount: number;
  phoneNumber: string;
  country: string;
  currency: string;
  email: string;
  name: string;
}

export interface MoMoPayoutRequest {
  amount: number;
  phoneNumber: string;
  country: string;
  currency: string;
}

export const paymentService = {
  async initiateMoMoCollection(data: MoMoPaymentRequest) {
    try {
      const response = await axios.post('/api/payments/momo/collect', data);
      return response.data;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    }
  },

  async initiateMoMoPayout(data: MoMoPayoutRequest) {
    try {
      const response = await axios.post('/api/payments/momo/payout', data);
      return response.data;
    } catch (error) {
      console.error('Payout initiation failed:', error);
      throw error;
    }
  }
};
