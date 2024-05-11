import { Container, Tabs } from '@mantine/core'
import classes from './SettingsHeader.module.css'

const tabs = ['Users Management', 'Account', 'Security', 'Application']

export function SettingsHeader() {
  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ))

  return (
    <div className={classes.header}>
      <Container size="md">
        <Tabs
          defaultValue="Home"
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
