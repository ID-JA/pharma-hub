import classes from './NewNavbar.module.css'
import { LinksGroup } from './LinksGroup'
import { ScrollArea } from '@mantine/core'
import brandImage from '@renderer/assets/brand.png'

const appLinks = [
  {
    icon: (
      <img
        height={28}
        width={28}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABB0lEQVR4nO2XMQ6CMBSG31105hgcxMQj4CLHgNCJxUU8hCEuzpxEZVIZflNYCIkmprVQ/L/khbwF+uW1Db8IIYR4CYrghEMAS1W6F7C3eOiiwN9NQAMlsFEyFhRQnIAZ3EJqIluoSQW7leCedP0j6fpn6sktVKwFUdg9db8f9JMXgOoW/KmnwC+YzS0Uhe/LCwH4OoFqK7fzRmBSVSzXSaatOl+0C6zzpfvUBkv/+FpglMwACgTjTkBj43ZpBca6qUAB4QTALaRmcIgbg7TVF3Ce2mAhbfUFnKc2WEhbwy3kNLVhTgLw+RBHBmmrL+A8tcH7CWRSmn60iuVi4z3I5Pi1ACGEiAtenOj5/Hw+DK4AAAAASUVORK5CYII="
      />
    ),
    label: 'Stock',
    notifications: 3,
    links: [
      {
        label: 'Nouveau Produit',
        to: '/medications/new',
        exact: true
      },
      {
        label: 'Produits',
        to: '/medications',
        exact: true
      },
      {
        label: 'Saisie inventaire STOCK',
        to: '/medications/inventory/new',
        exact: true
      },
      {
        label: "Consultation d'une fiche stock",
        to: '/medicaments/consultation',
        exact: true
      }
    ]
  },
  {
    icon: (
      <img
        height={28}
        width={28}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEN0lEQVR4nO1Z3WtcRRS/1Af1XxB9ER8EsVC75+ymrcadc93ElFYREi1CH/xABaHEFoNiSbAY0hbSpoptbRtokYr4oAgi+NCHqtiqFMVq1La+WFq1Rc3O3N179+vIzDY3d6+72buxdzdbe+DAMjM78/vN+Z2582FZ1+0aNpXGLVLAZqsbTYrkY1JgWRJWFOFGq5tMCkxLga4iZO2SsKBs6LOWguUyidukwHNK4FTWTq7hUWtZsF7aqbsV4V9z4Ocdskqk7gn3J9NwlyQYUwTfO714a+wEpA1DQWBS4AVJsE8R9GczK++UhBf/Dd6PxEXdRrfV/5ECL9TU2zAUOwFFsLsRwP/usCt2ApLwZFwEJMGJWMFzKnWzFOjFRwALeozYCOikjU8+aDx7/8rVVx049/bepDtWBEfjJqAIjuqx9JiLBuzYq25xRGKdJJxQAj+TBPn4gWM4H4p6aZUC9usPYZ4St0cmoAh/bDdg1cwFzkQmIAm2dxwwhSOCE5EJzKYTqzoNWIU8R9ATmYDeHiz0RW2/fOD38JaluYwEHFo68oGDVqvmpJPrOw1cXXG9IrZMQIrk8oadPpBiZ71oXwREcnlrs29DQuuuXmeFIweZ3TxrK536kp116Zr60renmEsldh62/TJ3cty0zz23sbavwwc4bM7QQJ0cwMuRk1jaQErAbD3wuSc3mEGKx4+xt2/K/NYg/FA/0sdcLptyd2IsMgF3cpzdV18yrgbubRAFVEokHlwYPMHj5vTUIJT5TU+bAb29u6vAdm7j/IvPzwPduY254HH5/K9c/PRYZAJOvVmvn8xFRfhEI81v0mfYBTvJ9HDpu2+YK2UThdxTG2rl8/lxLn19kgvvv8ucz/mz2YxA+dwZLv80w9703ggksKIEjCyOgPa+1ezt2cGVy5fMbOeHn62Wr+1ldl323tzF7tiIAZbfujkSgcIH73HhncPsjo4snkAkCb08bAZS/Wuqei94XPzkoyrI0SrooBU//rB9EoqSxO5rr1Rz4MAbnN+6hblYNHLRdZqIlo1JyMlxLv9ylit//2mW3DkChben/fogAe+t1+fLB+5bfBI3XUbtpImAlorR7g+n2Xl0rcmNSnaWS1+d8Nt6+/dUZTT8jE8gaLEto5E+ZJkeo/koYe/Ih0ybQ/hQuwCqJq63NVarJgmmOw1c+RGAQy2B11tXRfBbp4Gr4HZ6cPCGyASqB/glAJzmXR+yostHwI5OA1ZhGRFs7/JDPfz8/7lW6fqLrU4m92wrydqqcf8dNwZfXq66bAR6scx80PQVeHwE4AsrbtOPELFJSMBk25+YFOElSXBEr1rmiSn0bFQLEP/Qbcw1vcApSXA+JKHBtjzy6YtWvcQ6NqbCN2aKEivqnidMWWJFsC2PWst0H1eW6xndt7Vkn1nTmLG6yWQ3P3TPmSR4QbtfcN2uQfsHfcxrgxrgiEkAAAAASUVORK5CYII="
      />
    ),
    label: 'Vente',
    notifications: 4,
    links: [
      { label: 'Commandes Clients', to: '/sales/news', exact: true },
      { label: 'Commandes Validées', to: '/sales/', exact: true }
    ]
  },
  {
    icon: (
      <img
        height={28}
        width={28}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACrUlEQVR4nO2Yy2sTURTGL4IZu+hKdxJBsIKguGqixEBdTNI8J20MQmiENDOmak2iJNiAiCK6qIKvDAFTcFWqiKvuLDUZC66M7X/gQtwZMFV3llPutJPnJJmmTXun3A8+CIH5zvnNuWdCBiEqKioqKio9S0wVYTecSRZXM8mvH7KpbwO6BBAVkFSxlL21fBT1Svcuf4btWCPIO10DZJLF3z0DEHfpKOmuYbHBUDA4QTL8AImB9jZ8hzwzTB6ApuaZDReYf7B08KymifRoaVUAqg1Oxn3ABvkmO0Nh+Jg7VZ3EQv9hIgFYleYVO8bGYWXumDKJeQB0gIid0ArABnnwh6/Az/kjyiTuErID2gHYIA+RGwH4u9CPp7BWt9R6AWCDPKTvOGGtcAhDlEBijne1A3sJwAZ5eD19XrluGb6gPt0BOEPh2mtfELHEkwn1x2gr1/4+ELED0OD/+T5489TUGUBigEgA2PTss0EYHhuvaz6W8NUDdNqBvQQADd5/ACJBRwgoQGqfTmAqOgve0RhYHAHZ+HM6OrcjAFLOCBOCFYbcbtnXBCsszRi3BFBuVzgSmgaznVM1H3qyLYDM/TMts7MPTqtd0/zfGr+7aXfnlcAL7kswItyUbXH5K9+no2+7ApByxo7ZTZMoMO+bAF7dXjkpJou/1Irio6IUiD9+CVPPZ2Tjz0ohzh/vCmBCsHbMvn7VWtt8CfLMCaQm/OIJv7tpPE4WZ0AOGhXilQKK8d2SG3AEugIY8rg6Zl/0uHDjZXznWzbfTia79w8OwoGNRXyRjSJmG1fecjDqbXa1iM2bVxtzombMZju3SFp2RedYzqMsFA4d4WOyaxfNZPe6EGHZdTLbvI9aPepMNu4hIjS7ToM2n9ts5z7hc7t5dhd35O6g3mZTUVFRUaFGrQMM9Rv+3ZlwfQAAAABJRU5ErkJggg=="
      />
    ),
    label: 'Commande',
    links: [
      { label: 'Validation commandes', to: '/orders/new', exact: true },
      {
        label: 'Livraison BL',
        to: '/deliveries/new',
        exact: true
      },
      {
        label: 'Consultation commandes',
        to: '/deliveries/consultation',
        exact: true
      },
      { label: 'Règlement factures', to: '/bills/new', exact: true },
      {
        label: 'Emission Avoirs',
        to: '/credit-notes/new',
        exact: true
      }
    ]
  },
  {
    icon: (
      <img
        height={28}
        width={28}
        src="data:image/png;base64,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"
      />
    ),
    label: 'Paramétrage',
    links: [
      { label: 'Général', to: '/settings/', exact: true },
      { label: 'Types', to: '/settings/types', exact: true },
      {
        label: 'Forms',
        to: '/deliveries/new',
        exact: true
      },
      {
        label: 'Rayon',
        to: '/deliveries/consultation',
        exact: true
      },
      { label: 'Familles Thérapeutiques', to: '/', exact: true }
    ]
  }
]

export function NewNavbar() {
  const links = appLinks.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ))

  return (
    <>
      <div className={classes.header}>
        <img src={brandImage} alt="PharmaHub" height={38} />
      </div>
      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>
    </>
  )
}
