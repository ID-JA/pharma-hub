export const calculatePPH = (ppv, marge) => ppv * (1 - marge / 100)

export const calculatePriceAfterDiscount = (price, discountRate) =>
  price * (1 - discountRate / 100)

export const calculatePurchasePrice = (ppv, marge, quantity) =>
  ppv * (1 - marge / 100) * quantity


const pdfContentType = 'application/pdf'

export const base64toBlob = (data: string) => {
  const base64WithoutPrefix = data.substr(
    `data:${pdfContentType};base64,`.length
  )
  const bytes = atob(base64WithoutPrefix)
  let length = bytes.length
  let out = new Uint8Array(length)

  while (length--) {
    out[length] = bytes.charCodeAt(length)
  }

  return new Blob([out], { type: pdfContentType })
}
