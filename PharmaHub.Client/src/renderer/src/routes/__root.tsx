import '@mantine/core/styles.css'
import 'mantine-react-table/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/charts/styles.css'

import '@react-pdf-viewer/core/lib/styles/index.css'

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTheme, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Toaster } from 'sonner'

const theme = createTheme({
  primaryColor: 'green',
  colors: {
    dark: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0c0d21',
      '#01010a'
    ]
  }
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
            <Toaster position="top-right" />
            <Outlet />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  )
})
