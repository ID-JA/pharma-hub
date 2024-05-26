export function calculatePPH(ppv: number, marge: number) {
  return Number((ppv * (1 - marge / 100)).toFixed(2))
}
