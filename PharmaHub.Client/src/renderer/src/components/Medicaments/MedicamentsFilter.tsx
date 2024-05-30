import { useEffect } from 'react'
import {
  TextInput,
  ActionIcon,
  Select,
  Group,
  SegmentedControl
} from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { IconX } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

function MedicamentsFilter({
  search
}: {
  search: { name?: string | undefined }
}) {
  const navigate = useNavigate()

  const [filterQuery, setFilterQuery] = useDebouncedState(
    search.name ?? '',
    300
  )

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
    <Group py="md">
      <div>
        <SegmentedControl data={['Bar Code', 'Name & Form', 'Name & PPV']} />
        <TextInput
          flex="1"
          placeholder="Name, Code bar, DCI..."
          defaultValue={filterQuery}
          onChange={(e) => setFilterQuery(e.currentTarget.value)}
          rightSection={
            <ActionIcon
              disabled={!Boolean(filterQuery)}
              variant="default"
              onClick={() => setFilterQuery('')}
            >
              <IconX size={14} />
            </ActionIcon>
          }
        />
      </div>
    </Group>
  )
}

export default MedicamentsFilter
