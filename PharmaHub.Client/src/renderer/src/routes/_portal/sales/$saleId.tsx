import { Box, Fieldset, Group, Text, Title } from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'

export const Route = createFileRoute('/_portal/sales/$saleId')({
  component: SaleDetailPage
})
function SaleDetailPage() {
  const { saleId } = Route.useParams()

  const { data, isPending } = useQuery({
    queryKey: ['sale', saleId],
    queryFn: async () => (await http.get(`/api/sales/${saleId}`)).data,
    staleTime: 10000
  })

  return (
    <Box p="md">
      <Title order={3}>Sale information</Title>
      {isPending ? (
        'I am loading this page... wait please'
      ) : (
        <>
          <Fieldset legend="information" my="lg">
            <Group justify="space-between" wrap="nowrap" gap="xl" my="lg">
              <div>
                <Text>Sale Number:</Text>
                <Text size="xs" c="dimmed">
                  {data.id}
                </Text>
              </div>
              <div>
                <Text>Total Price:</Text>
                <Text size="xs" c="dimmed">
                  {data.totalPrice}
                </Text>
              </div>
              <div>
                <Text>Total Quantity:</Text>
                <Text size="xs" c="dimmed">
                  {data.totalQuantity}
                </Text>
              </div>
              <div>
                <Text>Discount:</Text>
                <Text size="xs" c="dimmed">
                  {data.discount}
                </Text>
              </div>
            </Group>
          </Fieldset>

          <Fieldset legend="Sale items">
            {data.saleMedicaments.length > 0
              ? data.saleMedicaments.map((item) => {
                  return (
                    <Group>
                      <div>
                        <div>Id:</div>
                        <div>{item.medicamentId}</div>
                      </div>
                      <div>
                        <div>PPV:</div>
                        <div>{item.ppv}</div>
                      </div>
                      <div>
                        <div>Quantity</div>
                        <div>{item.quantity}</div>
                      </div>
                      <div>
                        <div>Discount</div>
                        <div>{item.discount}</div>
                      </div>
                      <div>
                        <div>TVA</div>
                        <div>{item.tva}</div>
                      </div>
                      <div>
                        <div>Total Price</div>
                        <div>{item.totalPrice}</div>
                      </div>
                    </Group>
                  )
                })
              : 'Not items for this sale'}
          </Fieldset>
        </>
      )}
    </Box>
  )
}
