import { createFileRoute } from '@tanstack/react-router'
import cx from 'clsx'
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Group } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
export const Route = createFileRoute('/_portal/settings/')({
  component: () => {
    const { setColorScheme } = useMantineColorScheme()
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })
    return (
      <div>
        Hello /_portal/settings!
        <ActionIcon
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
        >
          <IconSun stroke={1.5} />
          <IconMoon stroke={1.5} />
        </ActionIcon>
      </div>
    )
  }
})
