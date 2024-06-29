import {
  Button,
  Group,
  Image,
  Text,
  TextInput,
  Title,
  rem
} from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import '@mantine/dropzone/styles.css'
import { useMutation, useQuery } from '@tanstack/react-query'
import { http } from '@renderer/utils/http'
import { useEffect } from 'react'
import { useForm } from '@mantine/form'
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'

export const Route = createFileRoute('/_portal/settings/')({
  component: BasicSettings
})

function BasicSettings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const response = await http.get('/api/settings')
      return response.data
    }
  })

  const form = useForm({
    initialValues: {
      pharmacyName: '',
      address: '',
      phone: '',
      logo: ''
    }
  })

  const { mutateAsync } = useMutation({
    mutationFn: async (values: any) => {
      const updatedSettings = Object.keys(values).map((key) => ({
        settingKey: key,
        settingValue: values[key]
      }))
      await http.put('/api/settings', updatedSettings)
    },
    onSuccess: () => {
      console.log('Settings updated successfully')
    },
    onError: (error) => {
      console.error('Error updating settings:', error)
    }
  })

  useEffect(() => {
    if (settings) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.settingKey] = setting.settingValue
        return acc
      }, {})

      form.setValues({
        pharmacyName: settingsMap['pharmacyName'] || '',
        address: settingsMap['address'] || '',
        phone: settingsMap['phone'] || '',
        logo: settingsMap['logo'] || ''
      })
    }
  }, [settings])

  const handleSubmit = async (values) => {
    mutateAsync(values)
  }

  const handleDrop = async (files) => {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        const base64String = e.target.result as string
        form.setFieldValue('logo', base64String)
      }
    }
    reader.readAsDataURL(file)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Title order={3}>Information de pharmacie</Title>
      <Group grow my="md">
        <TextInput
          label="Nom de pharmacie"
          {...form.getInputProps('pharmacyName')}
        />
        <TextInput
          label="Adresse pharmacie"
          {...form.getInputProps('address')}
        />
        <TextInput
          label="Téléphone pharmacie"
          {...form.getInputProps('phone')}
        />
      </Group>
      <Group>
        {form.values.logo && (
          <Image miw={300} radius="md" src={form.values.logo} />
        )}
        <Dropzone
          flex="1"
          onDrop={handleDrop}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Group
            justify="center"
            gap="xl"
            mih={220}
            style={{ pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-blue-6)'
                }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-red-6)'
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-dimmed)'
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Group>
      <Button type="submit">Enregistre Settings</Button>
    </form>
  )
}

export default BasicSettings
