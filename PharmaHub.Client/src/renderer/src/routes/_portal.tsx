import { ActionIcon, AppShell, Group, ScrollArea } from '@mantine/core'
import { Link, Outlet, createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useElementSize } from '@mantine/hooks'
import { IconArrowLeft, IconArrowRight, IconX } from '@tabler/icons-react'
import AppNavbar from '@renderer/components/PortalNavbar/AppNavbar'

export const Route = createFileRoute('/_portal')({
  component: PortalLayout
})

function PortalLayout() {
  const { ref, height } = useElementSize()
  const router = useRouter()
  const navigate = useNavigate()

  const goBack = () => {
    router.history.back()
  }

  const goForward = () => {
    router.history.forward()
  }

  const goHome = () => {
    router.navigate({ to: '/dashboard' })
  }

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <AppNavbar />
      </AppShell.Header>
      <AppShell.Main ref={ref} style={{ height: '100vh' }}>
        <Group style={{ position: 'fixed', zIndex: 100, right: 10, top: 10 }}>
          <ActionIcon component={Link} to="/dashboard" size="sm" variant="default" onClick={goBack}>
            <IconArrowLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            component={Link}
            to="/dashboard"
            size="sm"
            variant="default"
            onClick={goForward}
          >
            <IconArrowRight style={{ width: '70%', height: '70%' }} stroke={1.5} />
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
        </Group>
        <ScrollArea h={height}>
          <Outlet />
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  )
}
