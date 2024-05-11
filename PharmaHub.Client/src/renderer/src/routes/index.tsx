import { Button, Container, Paper, PasswordInput, TextInput, Title } from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { useForm } from '@mantine/form'

export const Route = createFileRoute('/')({
  component: LoginRoute
})

const schema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  email: z.string().email({ message: 'Invalid email' })
})

function LoginRoute() {
  const navigate = useNavigate()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      email: ''
    },
    validate: zodResolver(schema)
  })
  return (
    <Container size={500} h="100vh" style={{ display: 'grid', placeItems: 'center' }}>
      <form
        style={{ width: '100%' }}
        onSubmit={form.onSubmit((values) => {
          navigate({
            to: '/dashboard'
          })
          console.log(values)
        })}
      >
        <Title ta="center">PharmaHub App</Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" w="100%">
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  )
}
