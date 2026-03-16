import { apiFetch } from "../api"

export const paymentService = {

  async createPaymentIntent(data: {
    amount: number
    receiverId: string
  }) {
    return apiFetch("/payments/intent", {
      method: "POST",
      body: JSON.stringify(data)
    })
  },

  async getPayments() {
    return apiFetch("/payments")
  }

}