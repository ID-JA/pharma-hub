/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ResetPasswordImport } from './routes/reset-password'
import { Route as ForgetPasswordImport } from './routes/forget-password'
import { Route as PortalImport } from './routes/_portal'
import { Route as IndexImport } from './routes/index'
import { Route as PortalSettingsImport } from './routes/_portal/settings'
import { Route as PortalSalesImport } from './routes/_portal/sales'
import { Route as PortalMedicationsImport } from './routes/_portal/medications'
import { Route as PortalMedicamentsImport } from './routes/_portal/medicaments'
import { Route as PortalDashboardImport } from './routes/_portal/dashboard'
import { Route as PortalSettingsIndexImport } from './routes/_portal/settings/index'
import { Route as PortalMedicamentsIndexImport } from './routes/_portal/medicaments.index'
import { Route as PortalSettingsTypesImport } from './routes/_portal/settings_.types'
import { Route as PortalSettingsUsersImport } from './routes/_portal/settings/users'
import { Route as PortalSettingsFormsImport } from './routes/_portal/settings.forms'
import { Route as PortalSalesNewsImport } from './routes/_portal/sales_.news'
import { Route as PortalSalesNewImport } from './routes/_portal/sales_.new'
import { Route as PortalSalesSaleIdImport } from './routes/_portal/sales/$saleId'
import { Route as PortalOrdersNewImport } from './routes/_portal/orders.new'
import { Route as PortalOrdersConsultationImport } from './routes/_portal/orders.consultation'
import { Route as PortalMedicationsNewImport } from './routes/_portal/medications_.new'
import { Route as PortalMedicamentsFormsImport } from './routes/_portal/medicaments_.forms'
import { Route as PortalMedicamentsDciImport } from './routes/_portal/medicaments_.dci'
import { Route as PortalMedicamentsConsultationImport } from './routes/_portal/medicaments_.consultation'
import { Route as PortalMedicamentsMedicamentIdImport } from './routes/_portal/medicaments.$medicamentId'
import { Route as PortalDeliveriesNewImport } from './routes/_portal/deliveries.new'
import { Route as PortalDeliveriesConsultationImport } from './routes/_portal/deliveries.consultation'
import { Route as PortalCreditNotesNewImport } from './routes/_portal/credit-notes.new'
import { Route as PortalBillsNewImport } from './routes/_portal/bills.new'
import { Route as PortalMedicationsInventoryNewImport } from './routes/_portal/medications_.inventory.new'
import { Route as PortalMedicationsEditMedicationIdImport } from './routes/_portal/medications_.edit.$medicationId'
import { Route as PortalMedicamentsMedicamentIdHistoryImport } from './routes/_portal/medicaments.$medicamentId.history'

// Create/Update Routes

const ResetPasswordRoute = ResetPasswordImport.update({
  path: '/reset-password',
  getParentRoute: () => rootRoute,
} as any)

const ForgetPasswordRoute = ForgetPasswordImport.update({
  path: '/forget-password',
  getParentRoute: () => rootRoute,
} as any)

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

const PortalMedicationsRoute = PortalMedicationsImport.update({
  path: '/medications',
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

const PortalSettingsTypesRoute = PortalSettingsTypesImport.update({
  path: '/settings/types',
  getParentRoute: () => PortalRoute,
} as any)

const PortalSettingsUsersRoute = PortalSettingsUsersImport.update({
  path: '/users',
  getParentRoute: () => PortalSettingsRoute,
} as any)

const PortalSettingsFormsRoute = PortalSettingsFormsImport.update({
  path: '/forms',
  getParentRoute: () => PortalSettingsRoute,
} as any)

const PortalSalesNewsRoute = PortalSalesNewsImport.update({
  path: '/sales/news',
  getParentRoute: () => PortalRoute,
} as any)

const PortalSalesNewRoute = PortalSalesNewImport.update({
  path: '/sales/new',
  getParentRoute: () => PortalRoute,
} as any)

const PortalSalesSaleIdRoute = PortalSalesSaleIdImport.update({
  path: '/$saleId',
  getParentRoute: () => PortalSalesRoute,
} as any)

const PortalOrdersNewRoute = PortalOrdersNewImport.update({
  path: '/orders/new',
  getParentRoute: () => PortalRoute,
} as any)

const PortalOrdersConsultationRoute = PortalOrdersConsultationImport.update({
  path: '/orders/consultation',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicationsNewRoute = PortalMedicationsNewImport.update({
  path: '/medications/new',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicamentsFormsRoute = PortalMedicamentsFormsImport.update({
  path: '/medicaments/forms',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicamentsDciRoute = PortalMedicamentsDciImport.update({
  path: '/medicaments/dci',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicamentsConsultationRoute =
  PortalMedicamentsConsultationImport.update({
    path: '/medicaments/consultation',
    getParentRoute: () => PortalRoute,
  } as any)

const PortalMedicamentsMedicamentIdRoute =
  PortalMedicamentsMedicamentIdImport.update({
    path: '/$medicamentId',
    getParentRoute: () => PortalMedicamentsRoute,
  } as any)

const PortalDeliveriesNewRoute = PortalDeliveriesNewImport.update({
  path: '/deliveries/new',
  getParentRoute: () => PortalRoute,
} as any)

const PortalDeliveriesConsultationRoute =
  PortalDeliveriesConsultationImport.update({
    path: '/deliveries/consultation',
    getParentRoute: () => PortalRoute,
  } as any)

const PortalCreditNotesNewRoute = PortalCreditNotesNewImport.update({
  path: '/credit-notes/new',
  getParentRoute: () => PortalRoute,
} as any)

const PortalBillsNewRoute = PortalBillsNewImport.update({
  path: '/bills/new',
  getParentRoute: () => PortalRoute,
} as any)

const PortalMedicationsInventoryNewRoute =
  PortalMedicationsInventoryNewImport.update({
    path: '/medications/inventory/new',
    getParentRoute: () => PortalRoute,
  } as any)

const PortalMedicationsEditMedicationIdRoute =
  PortalMedicationsEditMedicationIdImport.update({
    path: '/medications/edit/$medicationId',
    getParentRoute: () => PortalRoute,
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
    '/forget-password': {
      id: '/forget-password'
      path: '/forget-password'
      fullPath: '/forget-password'
      preLoaderRoute: typeof ForgetPasswordImport
      parentRoute: typeof rootRoute
    }
    '/reset-password': {
      id: '/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof ResetPasswordImport
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
    '/_portal/medications': {
      id: '/_portal/medications'
      path: '/medications'
      fullPath: '/medications'
      preLoaderRoute: typeof PortalMedicationsImport
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
    '/_portal/bills/new': {
      id: '/_portal/bills/new'
      path: '/bills/new'
      fullPath: '/bills/new'
      preLoaderRoute: typeof PortalBillsNewImport
      parentRoute: typeof PortalImport
    }
    '/_portal/credit-notes/new': {
      id: '/_portal/credit-notes/new'
      path: '/credit-notes/new'
      fullPath: '/credit-notes/new'
      preLoaderRoute: typeof PortalCreditNotesNewImport
      parentRoute: typeof PortalImport
    }
    '/_portal/deliveries/consultation': {
      id: '/_portal/deliveries/consultation'
      path: '/deliveries/consultation'
      fullPath: '/deliveries/consultation'
      preLoaderRoute: typeof PortalDeliveriesConsultationImport
      parentRoute: typeof PortalImport
    }
    '/_portal/deliveries/new': {
      id: '/_portal/deliveries/new'
      path: '/deliveries/new'
      fullPath: '/deliveries/new'
      preLoaderRoute: typeof PortalDeliveriesNewImport
      parentRoute: typeof PortalImport
    }
    '/_portal/medicaments/$medicamentId': {
      id: '/_portal/medicaments/$medicamentId'
      path: '/$medicamentId'
      fullPath: '/medicaments/$medicamentId'
      preLoaderRoute: typeof PortalMedicamentsMedicamentIdImport
      parentRoute: typeof PortalMedicamentsImport
    }
    '/_portal/medicaments/consultation': {
      id: '/_portal/medicaments/consultation'
      path: '/medicaments/consultation'
      fullPath: '/medicaments/consultation'
      preLoaderRoute: typeof PortalMedicamentsConsultationImport
      parentRoute: typeof PortalImport
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
    '/_portal/medications/new': {
      id: '/_portal/medications/new'
      path: '/medications/new'
      fullPath: '/medications/new'
      preLoaderRoute: typeof PortalMedicationsNewImport
      parentRoute: typeof PortalImport
    }
    '/_portal/orders/consultation': {
      id: '/_portal/orders/consultation'
      path: '/orders/consultation'
      fullPath: '/orders/consultation'
      preLoaderRoute: typeof PortalOrdersConsultationImport
      parentRoute: typeof PortalImport
    }
    '/_portal/orders/new': {
      id: '/_portal/orders/new'
      path: '/orders/new'
      fullPath: '/orders/new'
      preLoaderRoute: typeof PortalOrdersNewImport
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
    '/_portal/sales/news': {
      id: '/_portal/sales/news'
      path: '/sales/news'
      fullPath: '/sales/news'
      preLoaderRoute: typeof PortalSalesNewsImport
      parentRoute: typeof PortalImport
    }
    '/_portal/settings/forms': {
      id: '/_portal/settings/forms'
      path: '/forms'
      fullPath: '/settings/forms'
      preLoaderRoute: typeof PortalSettingsFormsImport
      parentRoute: typeof PortalSettingsImport
    }
    '/_portal/settings/users': {
      id: '/_portal/settings/users'
      path: '/users'
      fullPath: '/settings/users'
      preLoaderRoute: typeof PortalSettingsUsersImport
      parentRoute: typeof PortalSettingsImport
    }
    '/_portal/settings/types': {
      id: '/_portal/settings/types'
      path: '/settings/types'
      fullPath: '/settings/types'
      preLoaderRoute: typeof PortalSettingsTypesImport
      parentRoute: typeof PortalImport
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
    '/_portal/medications/edit/$medicationId': {
      id: '/_portal/medications/edit/$medicationId'
      path: '/medications/edit/$medicationId'
      fullPath: '/medications/edit/$medicationId'
      preLoaderRoute: typeof PortalMedicationsEditMedicationIdImport
      parentRoute: typeof PortalImport
    }
    '/_portal/medications/inventory/new': {
      id: '/_portal/medications/inventory/new'
      path: '/medications/inventory/new'
      fullPath: '/medications/inventory/new'
      preLoaderRoute: typeof PortalMedicationsInventoryNewImport
      parentRoute: typeof PortalImport
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
    PortalMedicationsRoute,
    PortalSalesRoute: PortalSalesRoute.addChildren({ PortalSalesSaleIdRoute }),
    PortalSettingsRoute: PortalSettingsRoute.addChildren({
      PortalSettingsFormsRoute,
      PortalSettingsUsersRoute,
      PortalSettingsIndexRoute,
    }),
    PortalBillsNewRoute,
    PortalCreditNotesNewRoute,
    PortalDeliveriesConsultationRoute,
    PortalDeliveriesNewRoute,
    PortalMedicamentsConsultationRoute,
    PortalMedicamentsDciRoute,
    PortalMedicamentsFormsRoute,
    PortalMedicationsNewRoute,
    PortalOrdersConsultationRoute,
    PortalOrdersNewRoute,
    PortalSalesNewRoute,
    PortalSalesNewsRoute,
    PortalSettingsTypesRoute,
    PortalMedicationsEditMedicationIdRoute,
    PortalMedicationsInventoryNewRoute,
  }),
  ForgetPasswordRoute,
  ResetPasswordRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_portal",
        "/forget-password",
        "/reset-password"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_portal": {
      "filePath": "_portal.tsx",
      "children": [
        "/_portal/dashboard",
        "/_portal/medicaments",
        "/_portal/medications",
        "/_portal/sales",
        "/_portal/settings",
        "/_portal/bills/new",
        "/_portal/credit-notes/new",
        "/_portal/deliveries/consultation",
        "/_portal/deliveries/new",
        "/_portal/medicaments/consultation",
        "/_portal/medicaments/dci",
        "/_portal/medicaments/forms",
        "/_portal/medications/new",
        "/_portal/orders/consultation",
        "/_portal/orders/new",
        "/_portal/sales/new",
        "/_portal/sales/news",
        "/_portal/settings/types",
        "/_portal/medications/edit/$medicationId",
        "/_portal/medications/inventory/new"
      ]
    },
    "/forget-password": {
      "filePath": "forget-password.tsx"
    },
    "/reset-password": {
      "filePath": "reset-password.tsx"
    },
    "/_portal/dashboard": {
      "filePath": "_portal/dashboard.tsx",
      "parent": "/_portal"
    },
    "/_portal/medicaments": {
      "filePath": "_portal/medicaments.tsx",
      "parent": "/_portal",
      "children": [
        "/_portal/medicaments/$medicamentId",
        "/_portal/medicaments/"
      ]
    },
    "/_portal/medications": {
      "filePath": "_portal/medications.tsx",
      "parent": "/_portal"
    },
    "/_portal/sales": {
      "filePath": "_portal/sales.tsx",
      "parent": "/_portal",
      "children": [
        "/_portal/sales/$saleId"
      ]
    },
    "/_portal/settings": {
      "filePath": "_portal/settings.tsx",
      "parent": "/_portal",
      "children": [
        "/_portal/settings/forms",
        "/_portal/settings/users",
        "/_portal/settings/"
      ]
    },
    "/_portal/bills/new": {
      "filePath": "_portal/bills.new.tsx",
      "parent": "/_portal"
    },
    "/_portal/credit-notes/new": {
      "filePath": "_portal/credit-notes.new.tsx",
      "parent": "/_portal"
    },
    "/_portal/deliveries/consultation": {
      "filePath": "_portal/deliveries.consultation.tsx",
      "parent": "/_portal"
    },
    "/_portal/deliveries/new": {
      "filePath": "_portal/deliveries.new.tsx",
      "parent": "/_portal"
    },
    "/_portal/medicaments/$medicamentId": {
      "filePath": "_portal/medicaments.$medicamentId.tsx",
      "parent": "/_portal/medicaments",
      "children": [
        "/_portal/medicaments/$medicamentId/history"
      ]
    },
    "/_portal/medicaments/consultation": {
      "filePath": "_portal/medicaments_.consultation.tsx",
      "parent": "/_portal"
    },
    "/_portal/medicaments/dci": {
      "filePath": "_portal/medicaments_.dci.tsx",
      "parent": "/_portal"
    },
    "/_portal/medicaments/forms": {
      "filePath": "_portal/medicaments_.forms.tsx",
      "parent": "/_portal"
    },
    "/_portal/medications/new": {
      "filePath": "_portal/medications_.new.tsx",
      "parent": "/_portal"
    },
    "/_portal/orders/consultation": {
      "filePath": "_portal/orders.consultation.tsx",
      "parent": "/_portal"
    },
    "/_portal/orders/new": {
      "filePath": "_portal/orders.new.tsx",
      "parent": "/_portal"
    },
    "/_portal/sales/$saleId": {
      "filePath": "_portal/sales/$saleId.tsx",
      "parent": "/_portal/sales"
    },
    "/_portal/sales/new": {
      "filePath": "_portal/sales_.new.tsx",
      "parent": "/_portal"
    },
    "/_portal/sales/news": {
      "filePath": "_portal/sales_.news.tsx",
      "parent": "/_portal"
    },
    "/_portal/settings/forms": {
      "filePath": "_portal/settings.forms.tsx",
      "parent": "/_portal/settings"
    },
    "/_portal/settings/users": {
      "filePath": "_portal/settings/users.tsx",
      "parent": "/_portal/settings"
    },
    "/_portal/settings/types": {
      "filePath": "_portal/settings_.types.tsx",
      "parent": "/_portal"
    },
    "/_portal/medicaments/": {
      "filePath": "_portal/medicaments.index.tsx",
      "parent": "/_portal/medicaments"
    },
    "/_portal/settings/": {
      "filePath": "_portal/settings/index.tsx",
      "parent": "/_portal/settings"
    },
    "/_portal/medicaments/$medicamentId/history": {
      "filePath": "_portal/medicaments.$medicamentId.history.tsx",
      "parent": "/_portal/medicaments/$medicamentId"
    },
    "/_portal/medications/edit/$medicationId": {
      "filePath": "_portal/medications_.edit.$medicationId.tsx",
      "parent": "/_portal"
    },
    "/_portal/medications/inventory/new": {
      "filePath": "_portal/medications_.inventory.new.tsx",
      "parent": "/_portal"
    }
  }
}
ROUTE_MANIFEST_END */
