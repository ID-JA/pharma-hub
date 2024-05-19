import { Paper, Group, Badge, ActionIcon, Text } from '@mantine/core'
import { IconPencil, IconEye } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { forwardRef } from 'react'

const MedicamentCard = forwardRef<HTMLDivElement, any>(({ medicament }, ref) => {
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
          <ActionIcon
            variant="outline"
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
            size="sm"
          >
            <IconPencil style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>{' '}
          <ActionIcon
            variant="outline"
            size="sm"
            component={Link}
            to="/medicaments/$medicamentId"
            params={{
              medicamentId: medicament.id
            }}
            preload="intent"
          >
            <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  )
})

export default MedicamentCard
