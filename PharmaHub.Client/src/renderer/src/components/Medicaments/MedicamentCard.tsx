import { Paper, Group, Badge, ActionIcon, Text } from '@mantine/core'
import { IconPencil, IconEye, IconPlus } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { forwardRef } from 'react'

const MedicamentCard = forwardRef<HTMLDivElement, any>(({ medicament, handleAddItem }, ref) => {
  const navigate = useNavigate()

  return (
    <Paper key={medicament.id} ref={ref} px="md" py="xl" withBorder mb="md">
      <Group justify="space-between" align="center">
        <Group grow flex={1} align="center">
          <Text fw="bold">{medicament.name}</Text>
          <Text fw="bold">$ {medicament.ppv}</Text>
          <div>
            <Badge
              variant="outline"
              color={medicament.status.toUpperCase() === 'OUT OF STOCK' ? 'red' : 'green'}
            >
              {medicament.status}
            </Badge>
          </div>
        </Group>

        <Group>
          {handleAddItem && (
            <ActionIcon
              variant="outline"
              size="sm"
              onClick={() => {
                handleAddItem(medicament)
              }}
            >
              <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          )}
          {!handleAddItem && (
            <ActionIcon
              variant="outline"
              size="sm"
              onClick={() => {
                navigate({
                  search: (old) => {
                    return {
                      ...old,
                      medicamentId: medicament.id
                    }
                  },
                  to: '/medicaments',
                  replace: true
                })
              }}
            >
              <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          )}{' '}
          <ActionIcon
            component={Link}
            variant="outline"
            size="sm"
            to="/medicaments/$medicamentId"
            preload="intent"
            params={{
              medicamentId: medicament.id
            }}
          >
            <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  )
})

export default MedicamentCard
