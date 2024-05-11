import { AppShell, Burger, Title } from '@mantine/core'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useDisclosure } from '@mantine/hooks'
import { PortalNavbar } from '@renderer/components/PortalNavbar'

export const Route = createFileRoute('/_portal')({
  component: () => {
    const [opened, { toggle }] = useDisclosure()
    return (
      <div>
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened }
          }}
        >
          <AppShell.Header style={{ display: 'flex', alignItems: 'center' }} px="xl">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title c="green" order={4}>
              PharmaHub App
            </Title>
          </AppShell.Header>

          <AppShell.Navbar p="md">
            <PortalNavbar />
          </AppShell.Navbar>

          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
      </div>
    )
  }
})
