import { BarChart } from '@mantine/charts'
import { Grid, Group, SegmentedControl, Title } from '@mantine/core'
import { http } from '@renderer/utils/http'
import { useQueries } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useState } from 'react'

export const Route = createFileRoute('/_portal/dashboard')({
  component: Dashboard
})

function Dashboard() {
  const [value, setValue] = useState('-7')
  const [filterOptions, setFilterOptions] = useState({
    startDate: dayjs().subtract(7, 'days').toDate(),
    endDate: dayjs().add(1, 'day').toDate()
  })

  const [{ data: salesTimeSeries = [] }, { data: topSoldProducts = [] }] =
    useQueries({
      queries: [
        {
          queryKey: ['sales-time-series', filterOptions],
          queryFn: async () => {
            const res = (
              await http.get('/api/sales/count', {
                params: filterOptions
              })
            ).data
            return res
          }
        },
        {
          queryKey: ['top-sold-products', filterOptions],
          queryFn: async () => {
            const res = (
              await http.get('/api/medicaments/top-sold-products', {
                params: filterOptions
              })
            ).data
            return res
          }
        }
      ]
    })

  const handleChangeDate = (value: string) => {
    setValue(value)
    setFilterOptions({
      startDate: dayjs()
        .subtract(Math.abs(Number(value)), 'days')
        .toDate(),
      endDate: dayjs().add(1, 'day').toDate()
    })
  }
  return (
    <div>
      <SegmentedControl
        mb="lg"
        value={value}
        onChange={handleChangeDate}
        data={[
          { label: "Aujourd'hui", value: '-1' },
          { label: 'dernière semaine', value: '-7' },
          { label: 'dernière mois', value: '-30' },
          { label: 'dernière 6 mois', value: '-180' },
          { label: 'dernière année', value: '-365' }
        ]}
      />
      <Grid>
        <Grid.Col span={6}>
          <Title order={3} mb="xl">
            Ventes par jour
          </Title>
          <BarChart
            h={300}
            data={salesTimeSeries}
            dataKey="date"
            series={[{ name: 'count', color: 'green' }]}
            tickLine="y"
            withBarValueLabel
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={3} mb="xl">
            Ventes par jour
          </Title>
          <BarChart
            h={300}
            data={topSoldProducts}
            dataKey="medicationName"
            orientation="vertical"
            yAxisProps={{ width: 80 }}
            series={[{ name: 'totalQuantitySold', color: 'green' }]}
            tickLine="y"
            withBarValueLabel
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}

export default Dashboard
