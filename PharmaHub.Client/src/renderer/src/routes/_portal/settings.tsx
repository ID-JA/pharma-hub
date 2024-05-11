import { Box } from '@mantine/core'
import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/settings')({
  component: () => (
    <div>
      <SettingsHeader />
      <Box p="md">
        <Outlet />
      </Box>
    </div>
  )
})
