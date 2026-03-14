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

export interface PayPalPaymentRequest {
  amount: number;
  email: string;
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
  },

  async initiatePayPalCollection(data: PayPalPaymentRequest) {
    try {
      const response = await axios.post('/api/payments/paypal/collect', data);
      return response.data;
    } catch (error) {
      console.error('PayPal collection failed:', error);
      throw error;
    }
  },

  async initiatePayPalPayout(data: PayPalPaymentRequest) {
    try {
      const response = await axios.post('/api/payments/paypal/payout', data);
      return response.data;
    } catch (error) {
      console.error('PayPal payout failed:', error);
      throw error;
    }
  }
};
