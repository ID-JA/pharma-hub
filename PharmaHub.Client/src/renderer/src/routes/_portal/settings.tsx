import { Box } from '@mantine/core'
import { TabsHeader } from '@renderer/components/TabsHeader'
import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

const links = [
  {
    to: '/settings',
    label: 'Général',
    exact: true
  },
  {
    to: '/settings/users',
    label: 'Gestion d’utilisateurs'
  }
]
export const Route = createFileRoute('/_portal/settings')({
  component: () => (
    <div>
      <TabsHeader links={links} />
      <Box p="md">
        <Outlet />
      </Box>
    </div>
  )
})
