import '@mantine/core/styles.css'

import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { createTheme, MantineProvider } from '@mantine/core'

const theme = createTheme({
  primaryColor: 'green'
})
export const Route = createRootRoute({
  component: () => (
    <>
      <MantineProvider theme={theme}>
        <Outlet />
      </MantineProvider>
      <TanStackRouterDevtools />
    </>
  )
})
