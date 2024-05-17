import { ActionIcon, AppShell } from '@mantine/core'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useDisclosure } from '@mantine/hooks'
import { PortalNavbar } from '@renderer/components/PortalNavbar'
import { IconMenu } from '@tabler/icons-react'

export const Route = createFileRoute('/_portal')({
  component: PortalLayout
})

function PortalLayout() {
  const [opened, { toggle }] = useDisclosure(true)
  return (
    <div>
      <AppShell
        navbar={{ width: 300, breakpoint: 'xs', collapsed: { mobile: !opened, desktop: !opened } }}
      >
        <AppShell.Navbar p="md">
          <div
            style={{
              position: 'relative',
              height: 'inherit',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <ActionIcon
              style={{
                position: 'absolute',
                right: '-11%',
                top: '50%'
              }}
              radius="xl"
              variant="default"
              onClick={toggle}
            >
              <IconMenu style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>

            <PortalNavbar />
          </div>
        </AppShell.Navbar>

        <AppShell.Main style={{ height: '100vh' }}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </div>
  )
}
