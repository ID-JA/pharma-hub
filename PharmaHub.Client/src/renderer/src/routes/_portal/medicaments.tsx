import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/medicaments')({
  component: () => <div>Hello /_portal/medicaments!</div>
})
