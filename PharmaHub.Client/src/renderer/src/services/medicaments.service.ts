import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

const fetchMedicaments = async ({ pageParam, queryKey }) => {
  console.log({ queryKey })
  return (
    await http.get(`/api/medicaments/search`, {
      params: {
        query: queryKey[1].name,
        field: queryKey[1].field || 'name'
      }
    })
  ).data
}

export const useMedicaments = (opts: { name?: string; field?: string }) =>
  useInfiniteQuery(
    infiniteQueryOptions({
      queryKey: ['medicaments', opts],
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNextPage ? allPages.length + 1 : undefined
      },
      queryFn: fetchMedicaments
    })
  )

export const medicamentQueryOptions = (medicamentId: number | undefined) =>
  queryOptions({
    queryKey: ['medicament', medicamentId],
    queryFn: async () => {
      const res = await http.get(`/api/medicaments/${medicamentId}`)
      return res.data
    },
    enabled: medicamentId ? true : false
  })

export const useMedicament = (medicamentId) => useQuery(medicamentQueryOptions(medicamentId))

export const useMedicamentInventories = (medicamentId = null) => {
  return useQuery({
    queryKey: ['medicamentInventories', medicamentId],
    queryFn: async () => {
      return (await http.get(`/api/medicaments/${medicamentId}/inventories`)).data
    },
    enabled: Boolean(medicamentId)
  })
}

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
  return useMutation({
    mutationFn: async (data: any) => (await http.post('/api/medicaments', data)).data,
    onSuccess: () => toast.success('created successfully !!!')
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

export const useTaxesQuery = () => {
  return useQuery({
    queryKey: ['taxes'],
    queryFn: async () => (await http.get('/api/types')).data
  })
}

export const useDCIsQuery = (query = '') => {
  return useQuery({
    queryKey: ['dcis', name],
    queryFn: async () => (await http.get('/api/dcis', { params: { query } })).data.data
  })
}

export const useCreateInventory = (medicamentId) => {
  return useMutation({
    mutationFn: async (data: any) =>
      (await http.post(`/api/medicaments/${medicamentId}/inventories`, data)).data,
    onSuccess: () => console.log('created successfully !!!')
  })
}

export const useDeleteInventory = (medicamentId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inventoryId: any) =>
      (await http.delete(`/api/medicaments/${medicamentId}/inventories/${inventoryId}`)).data,
    onSuccess: () => console.log('deleted successfully !!!'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['medicamentInventories'] })
  })
}

export const useUpdateInventory = (medicamentId) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) =>
      (await http.put(`/api/medicaments/${medicamentId}/inventories/${data.id}`, data)).data,
    onSuccess: () => console.log('updated successfully !!!'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['medicamentInventories'] })
  })
}
