import classes from './NewNavbar.module.css'
import { LinksGroup } from './LinksGroup'

const moackData = [
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
      { label: 'Overview', to: '/d', exact: true },
      { label: 'Forecasts', to: '/s', exact: true },
      { label: 'Outlook', to: '/a', exact: true },
      { label: 'Real time', to: '/x', exact: true }
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
      { label: 'Règlement factures', to: '/', exact: true }
    ]
  }
]

export function NewNavbar() {
  const links = moackData.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ))

  return (
    <>
      <div className={classes.section}>
        <div className={classes.mainLinks}>{links}</div>
      </div>
    </>
  )
}
