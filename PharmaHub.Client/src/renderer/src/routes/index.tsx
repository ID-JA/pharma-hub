import {
  Button,
  Container,
  Image,
  Paper,
  PasswordInput,
  TextInput,
  Title
} from '@mantine/core'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { Link } from '@tanstack/react-router'
import brandImage from '@renderer/assets/brand.png'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  component: LoginRoute
})

const schema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  email: z.string().min(10, { message: 'Email is required' })
})

function LoginRoute() {
  const navigate = useNavigate()
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: 'Admin@123',
      email: 'AdminJake91'
    },
    validate: zodResolver(schema)
  })

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await http.post('/login', values)
    },
    onSuccess: () => {
      navigate({
        to: '/dashboard'
      })
    },
    onError: () => {
      toast.error('email ou password incorrect!!!')
    }
  })
  return (
    <Container
      size={500}
      h="100vh"
      style={{ display: 'grid', placeItems: 'center' }}
    >
      <form
        style={{ width: '100%' }}
        onSubmit={form.onSubmit((values) => {
          mutation.mutate(values)
        })}
      >
        <Image miw={300} src={brandImage} />
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
          <Button fullWidth mt="xl" type="submit" loading={mutation.isPending}>
            Sign in
          </Button>
          <Link
            to="/forget-password"
            style={{
              textAlign: 'center',
              display: 'block',
              color: 'black',
              marginTop: '.5rem'
            }}
          >
            Forgot password?
          </Link>
        </Paper>
      </form>
    </Container>
  )
}
