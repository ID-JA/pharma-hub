export const calculatePPH = (ppv, marge) => ppv * (1 - marge / 100)

export const calculatePriceAfterDiscount = (price, discountRate) =>
  price * (1 - discountRate / 100)

export const calculatePurchasePrice = (ppv, marge, quantity) =>
  ppv * (1 - marge / 100) * quantity
