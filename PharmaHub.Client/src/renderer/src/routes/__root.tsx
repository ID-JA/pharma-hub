import '@mantine/core/styles.css'
import 'mantine-react-table/styles.css'
import '@mantine/dates/styles.css'

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'

const theme = createTheme({
  primaryColor: 'green'
})
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

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
        <ReactQueryDevtools buttonPosition="bottom-left" />
      </QueryClientProvider>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
})
