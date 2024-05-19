/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PortalImport } from './routes/_portal'
import { Route as IndexImport } from './routes/index'
import { Route as PortalSettingsImport } from './routes/_portal/settings'
import { Route as PortalSalesImport } from './routes/_portal/sales'
import { Route as PortalMedicamentsImport } from './routes/_portal/medicaments'
import { Route as PortalDashboardImport } from './routes/_portal/dashboard'
import { Route as PortalSettingsIndexImport } from './routes/_portal/settings/index'
import { Route as PortalMedicamentsIndexImport } from './routes/_portal/medicaments.index'
import { Route as PortalSettingsUsersImport } from './routes/_portal/settings/users'
import { Route as PortalSalesNewImport } from './routes/_portal/sales_.new'
import { Route as PortalSalesSaleIdImport } from './routes/_portal/sales/$saleId'
import { Route as PortalMedicamentsFormsImport } from './routes/_portal/medicaments_.forms'
import { Route as PortalMedicamentsDciImport } from './routes/_portal/medicaments_.dci'
import { Route as PortalMedicamentsMedicamentIdImport } from './routes/_portal/medicaments.$medicamentId'
import { Route as PortalMedicamentsMedicamentIdHistoryImport } from './routes/_portal/medicaments.$medicamentId.history'

// Create/Update Routes

const PortalRoute = PortalImport.update({
  id: '/_portal',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PortalSettingsRoute = PortalSettingsImport.update({
  path: '/settings',
  getParentRoute: () => PortalRoute,
} as any)

const PortalSalesRoute = PortalSalesImport.update({
  path: '/sales',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicamentsRoute = PortalMedicamentsImport.update({
  path: '/medicaments',
  getParentRoute: () => PortalRoute,
} as any)

const PortalDashboardRoute = PortalDashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => PortalRoute,
} as any)

const PortalSettingsIndexRoute = PortalSettingsIndexImport.update({
  path: '/',
  getParentRoute: () => PortalSettingsRoute,
} as any)

const PortalMedicamentsIndexRoute = PortalMedicamentsIndexImport.update({
  path: '/',
  getParentRoute: () => PortalMedicamentsRoute,
} as any)

const PortalSettingsUsersRoute = PortalSettingsUsersImport.update({
  path: '/users',
  getParentRoute: () => PortalSettingsRoute,
} as any)

const PortalSalesNewRoute = PortalSalesNewImport.update({
  path: '/sales/new',
  getParentRoute: () => PortalRoute,
} as any)

const PortalSalesSaleIdRoute = PortalSalesSaleIdImport.update({
  path: '/$saleId',
  getParentRoute: () => PortalSalesRoute,
} as any)

const PortalMedicamentsFormsRoute = PortalMedicamentsFormsImport.update({
  path: '/medicaments/forms',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicamentsDciRoute = PortalMedicamentsDciImport.update({
  path: '/medicaments/dci',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicamentsMedicamentIdRoute =
  PortalMedicamentsMedicamentIdImport.update({
    path: '/$medicamentId',
    getParentRoute: () => PortalMedicamentsRoute,
  } as any)

const PortalMedicamentsMedicamentIdHistoryRoute =
  PortalMedicamentsMedicamentIdHistoryImport.update({
    path: '/history',
    getParentRoute: () => PortalMedicamentsMedicamentIdRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_portal': {
      id: '/_portal'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PortalImport
      parentRoute: typeof rootRoute
    }
    '/_portal/dashboard': {
      id: '/_portal/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof PortalDashboardImport
      parentRoute: typeof PortalImport
    }
    '/_portal/medicaments': {
      id: '/_portal/medicaments'
      path: '/medicaments'
      fullPath: '/medicaments'
      preLoaderRoute: typeof PortalMedicamentsImport
      parentRoute: typeof PortalImport
    }
    '/_portal/sales': {
      id: '/_portal/sales'
      path: '/sales'
      fullPath: '/sales'
      preLoaderRoute: typeof PortalSalesImport
      parentRoute: typeof PortalImport
    }
    '/_portal/settings': {
      id: '/_portal/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof PortalSettingsImport
      parentRoute: typeof PortalImport
    }
    '/_portal/medicaments/$medicamentId': {
      id: '/_portal/medicaments/$medicamentId'
      path: '/$medicamentId'
      fullPath: '/medicaments/$medicamentId'
      preLoaderRoute: typeof PortalMedicamentsMedicamentIdImport
      parentRoute: typeof PortalMedicamentsImport
    }
    '/_portal/medicaments/dci': {
      id: '/_portal/medicaments/dci'
      path: '/medicaments/dci'
      fullPath: '/medicaments/dci'
      preLoaderRoute: typeof PortalMedicamentsDciImport
      parentRoute: typeof PortalImport
    }
    '/_portal/medicaments/forms': {
      id: '/_portal/medicaments/forms'
      path: '/medicaments/forms'
      fullPath: '/medicaments/forms'
      preLoaderRoute: typeof PortalMedicamentsFormsImport
      parentRoute: typeof PortalImport
    }
    '/_portal/sales/$saleId': {
      id: '/_portal/sales/$saleId'
      path: '/$saleId'
      fullPath: '/sales/$saleId'
      preLoaderRoute: typeof PortalSalesSaleIdImport
      parentRoute: typeof PortalSalesImport
    }
    '/_portal/sales/new': {
      id: '/_portal/sales/new'
      path: '/sales/new'
      fullPath: '/sales/new'
      preLoaderRoute: typeof PortalSalesNewImport
      parentRoute: typeof PortalImport
    }
    '/_portal/settings/users': {
      id: '/_portal/settings/users'
      path: '/users'
      fullPath: '/settings/users'
      preLoaderRoute: typeof PortalSettingsUsersImport
      parentRoute: typeof PortalSettingsImport
    }
    '/_portal/medicaments/': {
      id: '/_portal/medicaments/'
      path: '/'
      fullPath: '/medicaments/'
      preLoaderRoute: typeof PortalMedicamentsIndexImport
      parentRoute: typeof PortalMedicamentsImport
    }
    '/_portal/settings/': {
      id: '/_portal/settings/'
      path: '/'
      fullPath: '/settings/'
      preLoaderRoute: typeof PortalSettingsIndexImport
      parentRoute: typeof PortalSettingsImport
    }
    '/_portal/medicaments/$medicamentId/history': {
      id: '/_portal/medicaments/$medicamentId/history'
      path: '/history'
      fullPath: '/medicaments/$medicamentId/history'
      preLoaderRoute: typeof PortalMedicamentsMedicamentIdHistoryImport
      parentRoute: typeof PortalMedicamentsMedicamentIdImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  PortalRoute: PortalRoute.addChildren({
    PortalDashboardRoute,
    PortalMedicamentsRoute: PortalMedicamentsRoute.addChildren({
      PortalMedicamentsMedicamentIdRoute:
        PortalMedicamentsMedicamentIdRoute.addChildren({
          PortalMedicamentsMedicamentIdHistoryRoute,
        }),
      PortalMedicamentsIndexRoute,
    }),
    PortalSalesRoute: PortalSalesRoute.addChildren({ PortalSalesSaleIdRoute }),
    PortalSettingsRoute: PortalSettingsRoute.addChildren({
      PortalSettingsUsersRoute,
      PortalSettingsIndexRoute,
    }),
    PortalMedicamentsDciRoute,
    PortalMedicamentsFormsRoute,
    PortalSalesNewRoute,
  }),
})

/* prettier-ignore-end */
