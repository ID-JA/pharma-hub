import { AppShell, Container } from '@mantine/core'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useDisclosure } from '@mantine/hooks'
import { NewNavbar } from '@renderer/components/PortalNavbar/NewNavbr'

export const Route = createFileRoute('/_portal')({
  component: PortalLayout
})

function PortalLayout() {
  const [opened, { toggle }] = useDisclosure(true)

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
    >
      <AppShell.Navbar p="md">
        <NewNavbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Container size="xl" px="lg" py="md">
          {/* <ScrollArea h={height}> */}
          <Outlet />
          {/* </ScrollArea> */}
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
