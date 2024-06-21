import { Select } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'

const SearchMedicament = ({
  setValue,
  label,
  medicationName
}: {
  setValue: (v) => void
  label: string
  medicationName?: any
}) => {
  const [search, setSearch] = useDebouncedState(medicationName, 500)

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
    enabled: medicationName || search ? true : false
  })

  return (
    <Select
      clearable
      label={label}
      searchable
      data={medicaments}
      value={medicationName}
      defaultValue={search}
      onSearchChange={setSearch}
      onChange={(v, option) => {
        setValue(option.id)
      }}
    />
  )
}
export default SearchMedicament
