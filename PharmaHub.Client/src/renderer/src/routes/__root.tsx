import '@mantine/core/styles.css'
import 'mantine-react-table/styles.css'
import '@mantine/dates/styles.css'

import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Button, createTheme, MantineProvider } from '@mantine/core'
import { ContextModalProps, ModalsProvider } from '@mantine/modals'
import { Toaster } from 'sonner'

const theme = createTheme({
  primaryColor: 'green',
  colors: {
    // override dark colors to change them for all components
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

const TestModal = ({
  context,
  id,
  innerProps
}: ContextModalProps<{ modalBody: string }>) => (
  <>
    <Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
      Close modal
    </Button>
  </>
)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <ModalsProvider modals={{ demonstration: TestModal }}>
            <Toaster position="top-right" />
            <Outlet />
          </ModalsProvider>
        </MantineProvider>
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </QueryClientProvider>
      {/* <TanStackRouterDevtools position="top-left" /> */}
    </>
  )
})
