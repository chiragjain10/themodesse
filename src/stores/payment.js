import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    paymentMethods: [
      {
        name: 'APPLE PAY',
        type: 'text-main-9'
      },
      {
        name: 'SHOP NOW, PAY LATER',
        type: 'text-clip'
      },
      {
        name: 'GOOGLE PAY',
        type: 'text-main-9'
      },
      {
        name: 'PAY IN 4',
        type: 'text-clip'
      },
      {
        name: 'CREDIT CARD',
        type: 'text-main-9'
      },
      {
        name: 'DEBIT CARD',
        type: 'text-clip'
      }
    ]
  })
}) 