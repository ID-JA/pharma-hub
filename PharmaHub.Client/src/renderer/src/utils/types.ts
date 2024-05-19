export type User = {
  id: string
  firstName: string
  lastName: string
  cni: string
  password: string
  gender: string
  phone: string
  email: string
  address: string
  role: string
}

export interface Medication {
  name: string
  dci: string
  form: string
  ppv: number
  pph: number
  tva: number
  discount: number
  pbr: number
  type: string
  marge: number
  quantity: number
  codebar: string
  family: string
  usedBy: number
  withPrescription: boolean
  //  stockHistories: any; // Assuming the type since it's null. If it can be more specific, adjust accordingly.
  // saleMedicaments: any; // Assuming the type since it's null. If it can be more specific, adjust accordingly.
  // orderMedicaments: any[]; // Assuming it can contain any type of objects. If more specific, adjust accordingly.
  id: number
  createdAt: string // Consider using Date type if you plan to handle Date objects.
  updatedAt: string // Consider using Date type if you plan to handle Date objects.
}

export type Sale = {
  status: string
  discount: number
  tva: number
  totalPrice: number
  totalQuantity: number
  saleMedicaments: SaleMedicament[]
}
type SaleMedicament = {
  medicamentId: number
  name: string
  ppv: number
  quantity: number
  tva: number
  discount: number
  totalPrice: number
}
