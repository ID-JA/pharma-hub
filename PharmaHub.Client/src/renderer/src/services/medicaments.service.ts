import { queryOptions } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'

const mockData = [
  {
    id: 1,
    name: 'Medicament 1',
    quantity: 10
  },
  {
    id: 72860,
    name: 'Medicament 72223',
    quantity: 202560
  },
  {
    id: 86525,
    name: 'Medicament 95699',
    quantity: 503560
  },
  {
    id: 54631,
    name: 'Medicament 54699',
    quantity: 415710
  },
  {
    id: 91484,
    name: 'Medicament 83381',
    quantity: 637290
  },
  {
    id: 9264,
    name: 'Medicament 81633',
    quantity: 501320
  },
  {
    id: 63367,
    name: 'Medicament 96349',
    quantity: 24610
  },
  {
    id: 21401,
    name: 'Medicament 66754',
    quantity: 950920
  },
  {
    id: 65256,
    name: 'Medicament 1714',
    quantity: 864450
  },
  {
    id: 5755,
    name: 'Medicament 51965',
    quantity: 919780
  },
  {
    id: 74305,
    name: 'Medicament 56942',
    quantity: 54710
  },
  {
    id: 35283,
    name: 'Medicament 79318',
    quantity: 34160
  },
  {
    id: 41297,
    name: 'Medicament 87623',
    quantity: 28860
  },
  {
    id: 80428,
    name: 'Medicament 70909',
    quantity: 609620
  },
  {
    id: 35245,
    name: 'Medicament 52377',
    quantity: 324500
  },
  {
    id: 2941,
    name: 'Medicament 73107',
    quantity: 445630
  },
  {
    id: 31739,
    name: 'Medicament 8527',
    quantity: 499920
  },
  {
    id: 97631,
    name: 'Medicament 60309',
    quantity: 204340
  }
]

export const medicamentsQueryOptions = (opts: {
  filterBy?: string
  sortBy?: 'name' | 'id' | 'email'
}) =>
  queryOptions({
    queryKey: ['medicaments', opts],
    queryFn: () => {
      return mockData
    }
  })

export const medicamentQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: () => mockData.filter((user) => user.id === userId)[0]
  })

export const dcisQueryOptions = (opts) => {
  return queryOptions({
    queryKey: ['dcis', opts],
    queryFn: async () => {
      const res = await http.get('/api/medicaments/dcis')
      return res.data
    }
  })
}

export const formsQueryOptions = (opts) => {
  return queryOptions({
    queryKey: ['forms', opts],
    queryFn: async () => {
      const res = await http.get('/api/medicaments/forms')
      return res.data
    }
  })
}
