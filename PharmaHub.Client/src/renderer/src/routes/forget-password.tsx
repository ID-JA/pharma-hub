import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  TextInput,
  Title
} from '@mantine/core'
import { http } from '@renderer/utils/http'
import { IconArrowRight } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/forget-password')({
  component: ForgetPasswordPage
})

function ForgetPasswordPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: any) => {
      await http.post('/api/auth/forgot-password', values)
    },
    onSuccess: () => {
      setEmail('')
      toast.success('Email envoyé')
      navigate({
        to: '/reset-password'
      })
    }
  })

  return (
    <Container
      size={500}
      h="100vh"
      style={{ display: 'grid', placeItems: 'center' }}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          await mutateAsync({ email })
        }}
      >
        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          w="100%"
          miw="500px"
        >
          <Group justify="space-between" mb="sm">
            <Title order={3}>Mot de passe oublié?</Title>
            <ActionIcon
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/' })}
            >
              <IconArrowRight />
            </ActionIcon>
          </Group>
          <TextInput
            label="Email"
            value={email}
            placeholder="you@mantine.dev"
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Button fullWidth mt="xl" type="submit" loading={isPending}>
            Envoyé
          </Button>
        </Paper>
      </form>
    </Container>
  )
}
