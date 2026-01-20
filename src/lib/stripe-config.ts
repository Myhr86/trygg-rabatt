// Stripe price IDs for Premium subscription
export const STRIPE_PRICES = {
  monthly: {
    priceId: 'price_1Src9JEFkaR706bzxriJIp0G',
    amount: 29,
    interval: 'month' as const,
    label: '29 kr/mnd',
  },
  yearly: {
    priceId: 'price_1Src9aEFkaR706bzBtPzCBa6',
    amount: 199,
    interval: 'year' as const,
    label: '199 kr/år',
    savings: 'Spar 149 kr',
  },
};
