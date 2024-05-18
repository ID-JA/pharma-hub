import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { Medication } from '@renderer/utils/types'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

const fetchMedicaments = async ({ pageParam, queryKey }) => {
  return (
    await http.get(`/api/medicaments`, {
      params: {
        'query.PageNumber': pageParam,
        'query.PageSize': 10,
        'query.Query': queryKey[1].name
      }
    })
  ).data
}
export const medicamentsInfiniteQueryOptions = (opts: { name?: string }) =>
  infiniteQueryOptions({
    queryKey: ['medicaments', opts],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined
    },
    queryFn: fetchMedicaments
  })

export const medicamentQueryOptions = (medicamentId: number | undefined) =>
  queryOptions({
    queryKey: ['medicament', medicamentId],
    queryFn: async () => {
      const res = await http.get(`/api/medicaments/${medicamentId}`)
      return res.data
    },
    enabled: medicamentId ? true : false
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

export const useCreateMedicament = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => (await http.post('/api/medicaments', data)).data,
    onSuccess: () => toast.success('created successfully !!!'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['medicaments'] })
  })
}

export const useUpdateMedicament = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => (await http.put(`/api/medicaments/${data.id}`, data)).data,
    onSuccess: () => toast.success('updated successfully !!!'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['medicaments'] })
  })
}

export const useDeleteMedicament = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (medicamentId: number) =>
      (await http.delete(`/api/medicaments/${medicamentId}`)).data,
    onSuccess: () => {
      toast.success('deleted successfully !!!')
      navigate({
        to: '/medicaments',
        replace: true
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['medicaments'] })
  })
}
