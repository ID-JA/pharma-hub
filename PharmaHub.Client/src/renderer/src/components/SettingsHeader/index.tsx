import { Container, Tabs } from '@mantine/core'
import classes from './SettingsHeader.module.css'
import { Link } from '@tanstack/react-router'

export function SettingsHeader() {
  const items = (
    [
      ['/settings', 'Summary', true],
      ['/settings/users', 'Users management']
    ] as const
  ).map(([to, label, exact]) => {
    return (
      <Tabs.Tab
        key={to}
        value={label}
        component={(props: any) => (
          <Link
            {...props}
            to={to}
            label={label}
            activeOptions={{ exact }}
            activeProps={{ className: `font-bold` }}
          />
        )}
      >
        {label}
      </Tabs.Tab>
    )
  })
  return (
    <div className={classes.header}>
      <Container size="md">
        <Tabs
          defaultValue="Summary"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  )
}
