import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/settings/')({
  component: () => {
    return <div>Hello /_portal/settings!</div>
  }
})
