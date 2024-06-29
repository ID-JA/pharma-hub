import { Select } from '@mantine/core'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'

const SearchMedicament = ({
  setValue,
  label,
  medicationName,
  search,
  setSearch,
  readOnly
}: {
  setValue: (v: number) => void
  label: string
  medicationName?: any
  search: string
  setSearch: (v: string) => void
  readOnly: boolean
}) => {
  const { data: medicaments = [] } = useQuery({
    queryKey: ['searchedMedicament', search],
    queryFn: async () => {
      const response = await http.get('/api/medicaments/search/names', {
        params: {
          query: search || medicationName
        }
      })
      return response.data.map((item) => ({
        value: item.name,
        label: item.name,
        id: item.id
      }))
    },
    enabled: !!search || !!medicationName
  })

  return (
    <Select
      readOnly={readOnly}
      clearable
      label={label}
      searchable
      data={medicaments}
      value={medicationName}
      onSearchChange={setSearch}
      onChange={(v, option: any) => {
        setValue(option.id)
      }}
    />
  )
}

export default SearchMedicament
