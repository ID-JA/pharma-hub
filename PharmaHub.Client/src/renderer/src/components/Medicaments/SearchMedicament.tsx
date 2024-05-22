import { Combobox, InputBase, useCombobox } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const SearchMedicament = ({
  value,
  setValue
}: {
  value: string | null
  setValue: (value: string) => void
}) => {
  const [search, setSearch] = useDebouncedState('', 500)

  const query = useQuery({
    queryKey: ['searchedMedicament', search],
    queryFn: async () => {
      return (
        await http.get('/api/medicaments', {
          params: {
            'query.Query': search
          }
        })
      ).data.data
    }
  })
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {}
  })

  const options = query.data?.map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      {item.name}
    </Combobox.Option>
  ))

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val, o) => {
        console.log(o)
        setValue(val)
        setSearch(o.children?.toString() || '')
        combobox.closeDropdown()
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          onChange={(event) => {
            combobox.openDropdown()
            combobox.updateSelectedOptionIndex()
            setSearch(event.currentTarget.value)
          }}
          defaultValue={search}
          onClick={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown()
            setSearch(search || '')
          }}
          label="Medicament Name"
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {query.isFetching ? (
            <Combobox.Empty>Loading....</Combobox.Empty>
          ) : options.length ? (
            options
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
export default SearchMedicament
