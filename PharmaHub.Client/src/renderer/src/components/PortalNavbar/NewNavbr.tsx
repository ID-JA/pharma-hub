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
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAL8ElEQVR4nO1deXAT1xl/OZqkJ22A9EjbpM0U2mkLIdAp4WhISnAwmCNASuIQaJvm4MwUAn+kDaU0KcmUhjsGAklIDFi7soWMjU+0T7aFLeND4PuQLcuHbMsLZEonlJCv855tYtnSvpW12l2BvpnfjMc63tvft/u9733v+z4hFJWoRCUqUYlKVKISlahEJSp6EmPBPYjHMYgT1iIO70W8kIN4fA5xQiPiBRHxwpU+iL3/I6/hbPpeo2UN4vAsZLCO1voyIkfMZ7+CODwf8XhnH9GfIx5DSKDfITgQh3cgozAPGWxf1voy9SWb4VZksExDHN6PeOFSyIQzIVxCHD6CeCEOGQy3oZtW3rfchQzCSsQLzvCTHvDpaES85WWUnn4nusnMzAbECe2aET9UEe2IF/5M53ZDC3nsOdykOeF8IEVgNzJaF6MbTlIs9yNeSNWcYF62Ik4gQ94P0Q0hvHVBr8uoA2L5YBdr4SkUsUIWtl53MiQiRpsLYB4ug00lNfBedRNYXG1Q4m6HvUlm2HXURLHveCqUtXnoawernbCxpAbicBn9rAJPw/7IW6STs0ciDp8Z7kVPyLTDG456sLk7oEcUQRyE7m4v7Pg42QeD30NAPlvgbod/OOpgQlZxCEoQ8pHBdjeKCDHlf49uooK8yK+b8mCNvRIKWzv8kjkcBQzGGXcHrLZXwtdS8obzJFShFPwDpGvhLT9FnNASlIkx5cPWrAKocrXKIjEUBfTD2dkNr+NiGHUiWEUILmTIH4t0KYacexGHm+VezC08hpdyCuGAMZ0SaLbYVFNAQ7MLdiamQAKfBpuybXCbMainoRXxufchHdr8KrkX8UB6IXB2xxAS65pcqiggMS3H57OHM63w4/TCYJ6ESv2sCcRDCGLBjbOWQ1NXN3i9XjiccsqHiMSTOWFXQPG5qiGfLa+qg5ZuLyzKcwSjhAJ9eEe8sEfOhG81Yvino86HDEdN/RAySitrwqaAzq5u2M+d9PlcUobF5z3EYyJzlamIndqST7btMiZ6R7KV+vD+SEnKsPgQcoBPowQHY1LkIttW7DPWrsQUcLrcQ973YU0T3Jksc4HmhCc1DC/gi3LI5xoC2/amllZKxEBiBHuZ4uQ3u9tg91GTzzhZBfaA70+qd9G5sxWAL2izKHPYLMfsHKrxf+cPRLq10OcJkGOGgkVVvZN+d/84CYZU8HR1SX6GPLXyzJFg0iC+w57YYJsfCO0eD7XNObaz1E6Hw/wQENNmKSql4Qu7o1LWZ7Y66uQuynFqxvOZ/v4Ca3lQ5Hi94bH7/uBua4eenh7Z718syzsSnOocd/L4VdZkiE/t6lKPUDHMIC7qA2ln2Eow4ldU8PmFNqlJkF3l0bxiaPd0ak6cqCDSnW66e2d4RO30qDVsQs9wpSexLstGF7k9x0zU3obLpRQ1wDMF59hPgQG/GL7sBcYB+mhTno+nQbf5KaegrKpWc/JEBVDn6YIRpnyWW9qAAG5RXgG88ChL+1uze+9+fzBkCNTn15pEMUSQwx4ZXtFvwqAAfJgVz2/o6ARsL4M9x074VcLe4yfC6maKCiKQV9bY2S3jPEE4qCz5xL1i7HrJYUr/JNs6PJCGz9CQ70AFkDVBa2JFCXR7vZCZcxr2HjgETc3NAd+3qqiSpYBLyrqkvemCkoMW+TnJqnM2w9G03Os73C6dLsil5Q7Y+vZ2mPzYE7Bq/Sbo8HiYJ2syXNI5yimAcbj+UFbgmEp/CLhcZwuxq8UNhz9KhMXL/gBjHpoMYyc+DG/v2C17gzYu085ajP+lpAIkz3jfkBly0INdz8w5Des2vQbjHn6EEk8wfuoMSElNC+q7/l7ODFGUKZcizshSJtkLWpMrSsBx7jy9ux+JnX+d9H5Mi5kLtiLpJ9gfsKuNtQ5cQ4mWUaErgOTnS/n+5gK/qSNao8PjAd5khvjnX6LmZTDxBIueXQENTuewvp9c8yhm3pFlZugKIMUREoOQpCmtyRYHwFZYBBv/uoWaFX+k92P1BvZiywI5XmWsA6sUUACpTAk8yKaSalUJ9ng64eAHR+DJ+BUwYdpj1JbPXRIPf1y5Fh6ds0CS9IGLrRJzebWkmqEAYZcSCsiWGiTQUWM4UFtXD3FPxTNJDoQHpz4K5vQMxeazv8rJWgcylVDAealBTje3qUJ+Z2cnxC5+etjkT4+JgzP2YkXnlMteiB1KKEDy8MXRHpodFWXi3fcOD5t84us3NA5vsfV0dgVEcUsrSwHO0BXACz1Sg3w2ZiHAt2cGhOiVf/IkSmDhM8t9zUn88xCTZYfZuSUw8U9rA5K//rXX6dMznDHJpixQcJHGtpLMrL1AtxIKuCI1yOfff0IVBYyb4uvVxGQUQly5iyLWVg1jJk31ef1nk6bAzn37QxqTpQBytszwgj69YRQwfmpgBcwprIWxE6f4vH7cmBLymHpRgKQJuvaTBaooYNGy3/sQPOHZF2C2UA6x+RUwafVGn9d+NWOWImPqwwQxFuGKWidcaHYHhBJEiCRH58OPZS+6m998S7FxpUCqcsK/COvIDZ3/9HNM8if/drZkLD8S3VDJjRipyVLjYkVRhPqGBsmNGPH1i4rPqjafBJU2YoxQhPJphKIEurq6IOHQBzBv6TL4+a+n09DCrAVL4K13dkGzS159gVLYcFaVUIR0MI5UI6p50aKOMBerEYyL0HC0GGZ4e0QYqUo4mvTbYRzIkFJQrQkRVYYg50CGlG6pcyRZLznZT9IwiJ3SqeCijkCy+Uy5+VDdEDjSu4V9JFmKFBPS7EhiMFIE7Zd4bIer81+hG7LL+5I0J1aUCVvp+eubLZLVUd0w1NP7paqH8qTTlLS2fczQpZIKuPLcXwC+8/j1HfG1XyyGC236PjsW+w7uB6dX0lqyUxao76vilJWWwguxqiZmkQr0i9X18OmabQD3xvgNS/x32yHNCRYZKKmolgw/JOdYYW0Bs17govK1Ajw+JDXoN3kMV8f9LmBM6GrsGvjEUqQ5waIM1DQ2wbH0034VsC8pFe5m144dQIoLZ5nBeuzMm98dQvxnU1bAf46la06qOAxU1jfCR6nZPgrYkiOjAwsnTA9Penpva8iAA9+TjOF/k+J7bf6DS+FyggFEnaYjikGA1DMfMWfR1gYjTczy1frwpKcTIQ3uGNp/Z3siXN59NKLcTlFmaHq5UCJn8X0BaVmiRMp4Mpoivw5AHISTskqUsDv87Qt4YT3rLvhRWiE0R0gdgCgDpLfF/XKK9EjcTKUyVWbnw/lBlqmKOgYzA6737m8Ib4HeQOGE2WxbyA5RiBGAv5XXyrD7StcDyFICPsGaFLGZeysbNSdRHCYOVDvltSrgcDJSXUhfTdqoQnpypOEFaXyhNZlikDhW54IvyWnWQVpyatZLjrPOldPh/HajFXZH0JOQUOWURz65dqOwEGkqMnuDkkeZNL7QmlxRAj19Np/pbn5x9/8b6aNBq1Agb8IY5uAy2rVQa7LFQSC9LUiDEbnXgXhsRYaKO5AuxJA9AnFCudzJk30C6b0g6oD4/k3WfXL8/C/u/Ar9NO0LoW3l0oJzUOvRLmRBiq6X284HYXL6dru6bexNmpqS5qZBXNAIUz5NbSFkqEV8Q2cXrW75Bqvvw9A734WSrWOQrsWIv0szwoK6MEzL/1cWVYa14pKc2r1cVAFfHU7rYtIrVPeti/uF2McgFmY0COMz7bQO19rSHlLKC0kdIeWk5ACdeYbLWnAT876FIkosltsRj7eF+ktII80FNBZDstDIzjS3uRVK2zzUZHm8PRTkb/I/8hqp2yLvJUlT7Lwdlr2nc9+pH29n2H0mIvYHHJagG0JIX00ZsSOkF5DYTsTY+2BDF1r+bBXPNDmN6kc11RaSrkG6C9I28Fgvd7wb8cI69eL5ehASwjDgF+lBhnbk19Mz3IheZJUQQ95E6m1w2KsC6Rd7f8rQMjN82QuRKu9b7qI2mEQZSb8dkmEcMuH0O0oRh7fTdMGbysyEKomWUcgoPE4LHThhN+JwFg369f6cbc+An7Ptof+jAUEhs++9q+hdrliKeFSiEpWoRCUqUYlKVKISlaggReT/bQfc0zoxAxsAAAAASUVORK5CYII="
      />
    ),
    label: 'Dashboard',
    notifications: 3,
    links: 'null',
    to: '/dashboard',
    exact: 'true'
  },

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
    label: 'Fournisseurs',
    notifications: 3,
    links: 'null',
    to: '/suppliers',
    exact: 'true'
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
        to: '/settings/forms',
        exact: true
      },
      {
        label: 'Rayon',
        to: '/settings/sections',
        exact: true
      },
      {
        label: 'Familles Thérapeutiques',
        to: '/settings/families',
        exact: true
      }
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
