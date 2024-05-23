import { Select, useCombobox } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'

const SearchMedicament = ({ setValue }) => {
  const [search, setSearch] = useDebouncedState('', 500)

  const { data: medicaments = [] } = useQuery({
    queryKey: ['searchedMedicament', search],
    queryFn: async () => {
      const response = await http.get('/api/medicaments', {
        params: {
          'query.Query': search
        }
      })
      return response.data.data.map((item) => ({
        value: item.id.toString(),
        label: item.name
      }))
    },
    enabled: !!search
  })

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {}
  })

  return (
    <Select
      label="Search Medicament"
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
