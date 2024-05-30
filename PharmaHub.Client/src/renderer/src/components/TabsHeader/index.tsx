import { Container, Tabs } from '@mantine/core'
import classes from './TabsHeader.module.css'
import { Link, useRouter } from '@tanstack/react-router'

export function TabsHeader({
  links
}: {
  links: { to: string; label: string; exact?: boolean }[]
}) {
  const router = useRouter()

  const items = links.map(({ to, label, exact }) => {
    return (
      <Tabs.Tab
        key={to}
        value={to}
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
          defaultValue={router.state.location.pathname}
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
