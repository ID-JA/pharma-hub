import { ActionIcon, AppShell, Group, ScrollArea } from '@mantine/core'
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
  useRouter
} from '@tanstack/react-router'
import { useDisclosure, useElementSize } from '@mantine/hooks'
import {
  IconArrowLeft,
  IconArrowRight,
  IconMenu,
  IconX
} from '@tabler/icons-react'
import AppNavbar from '@renderer/components/PortalNavbar/AppNavbar'

export const Route = createFileRoute('/_portal')({
  component: PortalLayout
})

function PortalLayout() {
  const { ref, height } = useElementSize()
  const router = useRouter()

  const goBack = () => {
    router.history.back()
  }

  const goForward = () => {
    router.history.forward()
  }

  const [openedHeader, { toggle }] = useDisclosure(true)

  return (
    <AppShell header={{ height: openedHeader ? 60 : 0 }}>
      <AppShell.Header
        style={{
          transform: openedHeader ? 'translateY(0)' : 'translateY(-60px)'
        }}
      >
        <AppNavbar />
      </AppShell.Header>
      <AppShell.Main ref={ref} style={{ height: '100vh' }}>
        <Group style={{ position: 'fixed', zIndex: 100, right: 10, top: 10 }}>
          <ActionIcon size="sm" variant="default" onClick={goBack}>
            <IconArrowLeft
              style={{ width: '70%', height: '70%' }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="sm" variant="default" onClick={goForward}>
            <IconArrowRight
              style={{ width: '70%', height: '70%' }}
              stroke={1.5}
            />
          </ActionIcon>

          <ActionIcon
            disabled={router.state.location.pathname === '/dashboard'}
            component={Link}
            to="/dashboard"
            size="sm"
            color="red"
          >
            <IconX style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>

          <ActionIcon onClick={toggle}>
            <IconMenu style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </Group>
        <ScrollArea h={height}>
          <Outlet />
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  )
}
