import { Menu, rem, Group, ActionIcon } from '@mantine/core'
import { IconSettings, IconMessageCircle } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useAddMedicamentModal } from '../Modals/AddMedicamentModal'

function AppNavbar() {
  return (
    <Group align="center" h="100%" px="lg">
      <StockMenu />
      <SaleMenu />
    </Group>
  )
}

export default AppNavbar

function StockMenu() {
  const { AddMedicamentModal, setOpened } = useAddMedicamentModal()
  return (
    <>
      <AddMedicamentModal />
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon size="50px" radius="100%" variant="default">
            <img
              height={40}
              width={40}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABB0lEQVR4nO2XMQ6CMBSG31105hgcxMQj4CLHgNCJxUU8hCEuzpxEZVIZflNYCIkmprVQ/L/khbwF+uW1Db8IIYR4CYrghEMAS1W6F7C3eOiiwN9NQAMlsFEyFhRQnIAZ3EJqIluoSQW7leCedP0j6fpn6sktVKwFUdg9db8f9JMXgOoW/KmnwC+YzS0Uhe/LCwH4OoFqK7fzRmBSVSzXSaatOl+0C6zzpfvUBkv/+FpglMwACgTjTkBj43ZpBca6qUAB4QTALaRmcIgbg7TVF3Ce2mAhbfUFnKc2WEhbwy3kNLVhTgLw+RBHBmmrL+A8tcH7CWRSmn60iuVi4z3I5Pi1ACGEiAtenOj5/Hw+DK4AAAAASUVORK5CYII="
            />{' '}
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            to="/medicaments/consultation"
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          >
            Stock Consultation
          </Menu.Item>
          <Menu.Item
            onClick={() => setOpened(true)}
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          >
            Add New Product
          </Menu.Item>
          <Menu.Item
            leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}
          >
            Remove expired stock
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}

function SaleMenu() {
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon size="50px" radius="100%" variant="default">
            <img
              height={40}
              width={40}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEN0lEQVR4nO1Z3WtcRRS/1Af1XxB9ER8EsVC75+ymrcadc93ElFYREi1CH/xABaHEFoNiSbAY0hbSpoptbRtokYr4oAgi+NCHqtiqFMVq1La+WFq1Rc3O3N179+vIzDY3d6+72buxdzdbe+DAMjM78/vN+Z2582FZ1+0aNpXGLVLAZqsbTYrkY1JgWRJWFOFGq5tMCkxLga4iZO2SsKBs6LOWguUyidukwHNK4FTWTq7hUWtZsF7aqbsV4V9z4Ocdskqk7gn3J9NwlyQYUwTfO714a+wEpA1DQWBS4AVJsE8R9GczK++UhBf/Dd6PxEXdRrfV/5ECL9TU2zAUOwFFsLsRwP/usCt2ApLwZFwEJMGJWMFzKnWzFOjFRwALeozYCOikjU8+aDx7/8rVVx049/bepDtWBEfjJqAIjuqx9JiLBuzYq25xRGKdJJxQAj+TBPn4gWM4H4p6aZUC9usPYZ4St0cmoAh/bDdg1cwFzkQmIAm2dxwwhSOCE5EJzKYTqzoNWIU8R9ATmYDeHiz0RW2/fOD38JaluYwEHFo68oGDVqvmpJPrOw1cXXG9IrZMQIrk8oadPpBiZ71oXwREcnlrs29DQuuuXmeFIweZ3TxrK536kp116Zr60renmEsldh62/TJ3cty0zz23sbavwwc4bM7QQJ0cwMuRk1jaQErAbD3wuSc3mEGKx4+xt2/K/NYg/FA/0sdcLptyd2IsMgF3cpzdV18yrgbubRAFVEokHlwYPMHj5vTUIJT5TU+bAb29u6vAdm7j/IvPzwPduY254HH5/K9c/PRYZAJOvVmvn8xFRfhEI81v0mfYBTvJ9HDpu2+YK2UThdxTG2rl8/lxLn19kgvvv8ucz/mz2YxA+dwZLv80w9703ggksKIEjCyOgPa+1ezt2cGVy5fMbOeHn62Wr+1ldl323tzF7tiIAZbfujkSgcIH73HhncPsjo4snkAkCb08bAZS/Wuqei94XPzkoyrI0SrooBU//rB9EoqSxO5rr1Rz4MAbnN+6hblYNHLRdZqIlo1JyMlxLv9ylit//2mW3DkChben/fogAe+t1+fLB+5bfBI3XUbtpImAlorR7g+n2Xl0rcmNSnaWS1+d8Nt6+/dUZTT8jE8gaLEto5E+ZJkeo/koYe/Ih0ybQ/hQuwCqJq63NVarJgmmOw1c+RGAQy2B11tXRfBbp4Gr4HZ6cPCGyASqB/glAJzmXR+yostHwI5OA1ZhGRFs7/JDPfz8/7lW6fqLrU4m92wrydqqcf8dNwZfXq66bAR6scx80PQVeHwE4AsrbtOPELFJSMBk25+YFOElSXBEr1rmiSn0bFQLEP/Qbcw1vcApSXA+JKHBtjzy6YtWvcQ6NqbCN2aKEivqnidMWWJFsC2PWst0H1eW6xndt7Vkn1nTmLG6yWQ3P3TPmSR4QbtfcN2uQfsHfcxrgxrgiEkAAAAASUVORK5CYII="
            />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            to="/medicaments/consultation"
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          >
            Sales Consultation
          </Menu.Item>
          <Menu.Item
            component={Link}
            to="/sales/new"
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          >
            Add New Sale
          </Menu.Item>
          <Menu.Item
            leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}
          >
            Returned Clients
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconMessageCircle style={{ width: rem(14), height: rem(14) }} />}
          >
            Clients Management
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}
