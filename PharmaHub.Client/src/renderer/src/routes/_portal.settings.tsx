import { SettingsHeader } from '@renderer/components/SettingsHeader'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_portal/settings')({
  component: () => (
    <div>
      <SettingsHeader />
      Hello /settings!
    </div>
  )
})
