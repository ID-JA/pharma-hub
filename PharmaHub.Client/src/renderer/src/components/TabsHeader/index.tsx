import { Container, Tabs } from '@mantine/core'
import classes from './TabsHeader.module.css'
import { Link } from '@tanstack/react-router'

export function TabsHeader({
  links,
  defaultValue
}: {
  links: { to: string; label: string; exact?: boolean }[]
  defaultValue: string
}) {
  const items = links.map(({ to, label, exact }) => {
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
          defaultValue={defaultValue}
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
