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
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: any) => {
      await http.post('/api/auth/reset-password', values)
    },
    onSuccess: () => {
      setPassword('')
      toast.success('Password Réinitialisé')
      localStorage.removeItem('token')
      navigate({
        to: '/'
      })
    },
    onError: () => toast.error('Vérifie le lien de réinitialisation')
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
          const code = localStorage.getItem('token') || null
          if (code && email && password) {
            await mutateAsync({ password, email, token: code }, {})
          } else {
            toast.error('Vérifie le lien de réinitialisation')
          }
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
            <Title order={3}>Réinitialiser le mot de passe</Title>
            <ActionIcon
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/' })}
            >
              <IconArrowRight />
            </ActionIcon>
          </Group>
          <TextInput
            required
            mb="md"
            type="email"
            label="Votre Email Adresse"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <TextInput
            required
            label="Nouveau Mot de Passe"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button fullWidth mt="xl" type="submit" loading={isPending}>
            Envoyé
          </Button>
        </Paper>
      </form>
    </Container>
  )
}
