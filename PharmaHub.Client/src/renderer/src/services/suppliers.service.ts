import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'

export const userSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      return (await http.get('/api/suppliers')).data
    }
  })
}
