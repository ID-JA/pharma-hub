import { BarChart, LineChart } from '@mantine/charts'
import {
  ActionIcon,
  Box,
  Grid,
  Group,
  SegmentedControl,
  Text,
  Title
} from '@mantine/core'
import { http } from '@renderer/utils/http'
import { IconEye } from '@tabler/icons-react'
import { useQueries } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
    { data: topSoldProductsResult = { topProducts: [], totalProducts: 0 } },
    { data: ordersDeliveriesQuantities = [] },
    { data: notSoldProducts = [] }
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
      },
      {
        queryKey: ['product-not-sold', filterOptions],
        queryFn: async () => {
          const res = (
            await http.get('/api/medicaments/not-sold', {
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

  const navigate = useNavigate()
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
      <Group>
        <Group my="xl">
          <Text fw="bold" fz="20px" td="underline">
            Produit Dormants:
          </Text>
          <Text fw="bold" fz="20px">
            {notSoldProducts.length}
          </Text>
          <ActionIcon
            variant="light"
            onClick={() => {
              navigate({
                to: '/medications',
                search: {
                  active: 'medications-not-sold'
                }
              })
            }}
          >
            <IconEye />
          </ActionIcon>
        </Group>
        <Group my="xl">
          <Text fw="bold" fz="20px" td="underline">
            Total des Produit:
          </Text>
          <Text fw="bold" fz="20px">
            {topSoldProductsResult.totalProducts}
          </Text>
          <ActionIcon
            variant="light"
            onClick={() => {
              navigate({
                to: '/medications',
                search: {
                  active: 'all-medications'
                }
              })
            }}
          >
            <IconEye />
          </ActionIcon>
        </Group>
      </Group>
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
              { name: 'returned', color: 'red.6', label: 'retourné' },
              { name: 'paid', color: 'green.6', label: 'payé' },
              {
                name: 'outOfStock',
                color: 'orange.6',
                label: 'en rupture de stock'
              },
              { name: 'pending', color: 'yellow.6', label: 'en attente' }
            ]}
            tickLine="y"
            withBarValueLabel
          />
          <Title order={3} mt="xl">
            Quantités Vendues
          </Title>
          <LineChart
            mt="xl"
            h={300}
            data={salesTimeSeries.salesQuantities}
            series={[{ name: 'quantity', label: 'Quantité' }]}
            dataKey="date"
            type="gradient"
            gradientStops={[
              { offset: 40, color: 'green.5' },
              { offset: 70, color: 'yellow.5' },
              { offset: 80, color: 'orange.5' },
              { offset: 100, color: 'red.6' }
            ]}
            strokeWidth={5}
            curveType="natural"
            yAxisProps={{ domain: [-0, 40] }}
            valueFormatter={(value) => `${value} Unit`}
          />
        </Grid.Col>
        <Grid.Col span={6} px="xl">
          <Title order={3} mb="xl">
            Top 10 Produits
          </Title>
          <BarChart
            h={300}
            data={topSoldProductsResult.topProducts}
            dataKey="medicationName"
            orientation="vertical"
            yAxisProps={{ width: 80 }}
            series={[
              {
                name: 'totalQuantitySold',
                color: 'green',
                label: 'Total Quantité'
              }
            ]}
            tickLine="y"
            withBarValueLabel
          />
          <Title order={3} mt="xl">
            Commandes et Livraisons
          </Title>
          <BarChart
            mt="xl"
            h={300}
            data={ordersDeliveriesQuantities}
            dataKey="date"
            series={[
              {
                name: 'quantityReceived',
                color: 'green.6',
                label: 'Quantité Livré'
              },
              {
                name: 'quantityOrdered',
                color: 'yellow.6',
                label: 'Quantité Commandé'
              }
            ]}
            tickLine="y"
            withBarValueLabel
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}

export default Dashboard
