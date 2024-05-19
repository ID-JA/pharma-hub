import { http } from '@renderer/utils/http'
import { Sale } from '@renderer/utils/types'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateSale = () => {
  return useMutation({
    mutationFn: async (data: Sale) => {
      const res = await http.post('/api/sales', data)
      return res.data
    }
  })
}
