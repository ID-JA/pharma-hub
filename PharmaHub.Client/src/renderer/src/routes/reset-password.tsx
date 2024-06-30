import { Button, Container, Paper, TextInput, Title } from '@mantine/core'
import { http } from '@renderer/utils/http'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage
})

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const { mutateAsync } = useMutation({
    mutationFn: async (values: any) => {
      http.post('/reset-password', values)
    },
    onSuccess: () => {
      setPassword('')
      toast.success('Password envoyé')
    }
  })
  return (
    <Container
      size={500}
      h="100vh"
      style={{ display: 'grid', placeItems: 'center' }}
    >
      <form
        onSubmit={async () => {
          await mutateAsync({ password })
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
          <Title order={3} mb="sm">
            Réinitialiser le mot de passe
          </Title>
          <TextInput
            label="Neveu Mot de Passe"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button fullWidth mt="xl" type="submit">
            Envoyé
          </Button>
        </Paper>
      </form>
    </Container>
  )
}
