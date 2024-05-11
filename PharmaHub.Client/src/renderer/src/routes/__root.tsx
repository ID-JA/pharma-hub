import '@mantine/core/styles.css'

import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { MantineProvider } from '@mantine/core'

export const Route = createRootRoute({
  component: () => (
    <>
      <MantineProvider>
        <Outlet />
      </MantineProvider>

      <TanStackRouterDevtools />
    </>
  )
})
