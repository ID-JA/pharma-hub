import { useEffect } from 'react'
import { TextInput, ActionIcon, Select, Group } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconX } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

function MedicamentsFilter({ search }: { search: { name?: string | undefined } }) {
  const navigate = useNavigate()

  const [filterQuery, setFilterQuery] = useDebouncedState(search.name ?? '', 300)

  useEffect(() => {
    navigate({
      search: (old) => {
        return {
          ...old,
          name: filterQuery || undefined
        }
      },
      replace: true
    })
  }, [filterQuery])

  return (
    <Group
      py="md"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: 'white'
      }}
    >
      <TextInput
        flex="1"
        label="Search for medicaments"
        placeholder="Name, Code bar, DCI..."
        defaultValue={filterQuery}
        onChange={(e) => setFilterQuery(e.currentTarget.value)}
        rightSection={
          <ActionIcon variant="default" onClick={() => setFilterQuery('')}>
            <IconX size={14} />
          </ActionIcon>
        }
      />
      <Select
        defaultChecked
        defaultValue="All"
        label="Status"
        data={['All', 'In Stock', 'Out of Stock']}
      />
    </Group>
  )
}

export default MedicamentsFilter
