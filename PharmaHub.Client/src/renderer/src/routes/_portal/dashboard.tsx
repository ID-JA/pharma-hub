import { BarChart, LineChart } from '@mantine/charts'
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

  const [
    {
      data: salesTimeSeries = {
        sales: [],
        salesQuantities: []
      }
    },
    { data: topSoldProducts = [] },
    {
      data: ordersDeliveriesInsights = {
        orders: [],
        deliveries: [],
        orderedQuantities: [],
        deliveredQuantities: []
      }
    }
  ] = useQueries({
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
      },
      {
        queryKey: ['orders-deliveries-insights', filterOptions],
        queryFn: async () => {
          const res = (
            await http.get('/api/deliveries/analytics', {
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
      <Grid px="xl" mt="md">
        <Grid.Col span={6}>
          <Title order={3} mb="xl">
            Ventes Par Jour
          </Title>
          <BarChart
            h={300}
            data={salesTimeSeries.sales}
            dataKey="date"
            series={[
              { name: 'returned', color: 'red.6' },
              { name: 'paid', color: 'green.6' },
              { name: 'outOfStock', color: 'orange.6' },
              { name: 'pending', color: 'yellow.6' }
            ]}
            tickLine="y"
            withBarValueLabel
          />
          <Title order={3} mt="xl">
            Les Quantités Vendues
          </Title>
          <LineChart
            mt="xl"
            h={300}
            data={salesTimeSeries.salesQuantities}
            series={[{ name: 'quantity', label: 'Quantité' }]}
            dataKey="date"
            strokeWidth={5}
            curveType="natural"
            yAxisProps={{ domain: [-25, 40] }}
            valueFormatter={(value) => `${value} Unite(s)`}
          />
        </Grid.Col>
        <Grid.Col span={6} px="xl">
          <Title order={3} mb="xl">
            Top 10 Produits
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
      <Grid px="xl">
        <Grid.Col span={6}>
          <Title order={3} mb="xl">
            Les Commandes
          </Title>
          <BarChart
            h={300}
            data={ordersDeliveriesInsights.orders}
            dataKey="date"
            series={[
              { name: 'received', color: 'green.6' },
              { name: 'pending', color: 'yellow.6' }
            ]}
            tickLine="y"
            withBarValueLabel
          />
          <Title order={3} mt="xl">
            Quantités Commandées
          </Title>
          <BarChart
            mt="xl"
            h={300}
            data={ordersDeliveriesInsights.orderedQuantities}
            series={[{ name: 'quantity', label: 'Quantité' }]}
            dataKey="date"
          />
        </Grid.Col>
        <Grid.Col span={6} px="xl">
          <Title order={3} mb="xl">
            Les Livraisons
          </Title>
          <BarChart
            h={300}
            data={ordersDeliveriesInsights.deliveries}
            dataKey="date"
            series={[
              { name: 'return', color: 'red.6' },
              { name: 'paid', color: 'green.6' }
            ]}
            tickLine="y"
            withBarValueLabel
          />
          <Title order={3} mt="xl">
            Quantités Livrées
          </Title>
          <BarChart
            mt="xl"
            h={300}
            data={ordersDeliveriesInsights.deliveredQuantities}
            series={[{ name: 'quantity', label: 'Quantité' }]}
            dataKey="date"
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}

export default Dashboard
