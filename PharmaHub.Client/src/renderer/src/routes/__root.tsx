import '@mantine/core/styles.css'
import 'mantine-react-table/styles.css'
import '@mantine/dates/styles.css'

import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { createRootRouteWithContext } from '@tanstack/react-router'

const theme = createTheme({
  primaryColor: 'green'
})
export const queryClient = new QueryClient()

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Outlet />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  )
})
