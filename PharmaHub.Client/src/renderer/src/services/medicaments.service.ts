import { queryOptions } from '@tanstack/react-query'

const mockData = [
  {
    id: 1,
    name: 'Medicament 1',
    quantity: 10
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
