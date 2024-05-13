import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/sales/')({
  component: () => <div>Hello /_portal/sales/!</div>
})