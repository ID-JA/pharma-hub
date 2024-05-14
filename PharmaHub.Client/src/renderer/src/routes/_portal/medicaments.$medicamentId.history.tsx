import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/medicaments/$medicamentId/history')({
  component: () => <div>Hello to history!</div>
})
