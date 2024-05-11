import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/dashboard')({
  component: () => <div>I am in /_portal/dashboard.tsx</div>
})
