import { Select } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'

const SearchMedicament = ({ setValue, label }) => {
  const [search, setSearch] = useDebouncedState('', 500)

  const { data: medicaments = [] } = useQuery({
    queryKey: ['searchedMedicament', search],
    queryFn: async () => {
      const response = await http.get('/api/medicaments/search/names', {
        params: {
          query: search
        }
      })
      return response.data.map((item) => ({
        value: item.id.toString(),
        label: item.name
      }))
    },
    enabled: !!search
  })

  return (
    <Select
      clearable
      label={label}
      searchable
      data={medicaments}
      defaultValue={search}
      onSearchChange={setSearch}
      onChange={(value) => {
        console.log(value)
        setValue(value)
      }}
    />
  )
}
export default SearchMedicament
