# TravelPro - Estructura del Proyecto

## Descripción
TravelPro es una aplicación de gestión de viajes multi-tenant diseñada para agencias de viajes. Permite gestionar clientes, pasajeros, proveedores, ventas y pagos de manera eficiente.

## Arquitectura

### Frontend (React + TypeScript)
- **Framework**: React 18 con TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v6

### Backend (Node.js + Express)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL con Prisma ORM
- **Authentication**: JWT
- **Validation**: Zod

## Estructura de Carpetas

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes de UI base
│   ├── auth/            # Componentes de autenticación
│   ├── sales/           # Componentes específicos de ventas
│   ├── clients/         # Componentes de clientes
│   ├── passengers/      # Componentes de pasajeros
│   ├── suppliers/       # Componentes de proveedores
│   └── layout/          # Componentes de layout
├── pages/               # Páginas de la aplicación
│   ├── auth/            # Páginas de autenticación
│   ├── dashboard/       # Dashboard principal
│   ├── sales/           # Páginas de ventas
│   ├── clients/         # Páginas de clientes
│   ├── passengers/      # Páginas de pasajeros
│   └── suppliers/       # Páginas de proveedores
├── hooks/               # Custom hooks
├── lib/                 # Utilidades y configuración
│   ├── services/        # Servicios de API
│   ├── utils.ts         # Utilidades generales
│   ├── constants.ts     # Constantes de la aplicación
│   ├── config.ts        # Configuración
│   └── validations.ts   # Esquemas de validación
├── types/               # Definiciones de tipos TypeScript
├── contexts/            # Contextos de React
└── main.tsx            # Punto de entrada
```

## Características Multi-Tenant

### Aislamiento de Datos
- Cada empresa tiene su propio `companyId`
- Todos los datos están filtrados por `companyId`
- Los usuarios solo pueden acceder a datos de su empresa

### Estructura de Base de Datos
```sql
-- Tabla principal de empresas
Company (id, name, ...)

-- Todas las entidades principales incluyen companyId
User (id, companyId, username, email, ...)
Client (id, companyId, name, ...)
Sale (id, companyId, ...)
Passenger (id, companyId, ...)
Supplier (id, companyId, ...)
```

## Componentes Principales

### UI Components
- `LoadingSpinner`: Spinner de carga estandarizado
- `PageLayout`: Layout estandarizado para páginas
- `ErrorMessage`: Componente de mensajes de error
- `SuccessMessage`: Componente de mensajes de éxito
- `ConfirmModal`: Modal de confirmación

### Custom Hooks
- `useLoadingState`: Manejo de estados de carga
- `useCrudOperations`: Operaciones CRUD genéricas
- `useAuthState`: Estado de autenticación

### Servicios
- `authService`: Autenticación y autorización
- `salesService`: Gestión de ventas
- `clientsService`: Gestión de clientes
- `passengersService`: Gestión de pasajeros
- `suppliersService`: Gestión de proveedores

## Validaciones

### Frontend
- Esquemas Zod centralizados en `lib/validations.ts`
- Validación en tiempo real con React Hook Form
- Mensajes de error estandarizados

### Backend
- Validación de entrada con Zod
- Middleware de autenticación
- Verificación de `companyId` en todas las operaciones

## Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3001
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### Configuración de la Aplicación
- Configuración centralizada en `lib/config.ts`
- Constantes en `lib/constants.ts`
- Soporte para múltiples idiomas y monedas

## Patrones de Código

### Componentes
- Componentes funcionales con TypeScript
- Props tipadas con interfaces
- Uso de custom hooks para lógica reutilizable

### Estado
- Context API para estado global
- useState/useEffect para estado local
- Custom hooks para lógica compleja

### API
- Cliente API centralizado
- Manejo de errores consistente
- Interceptores para autenticación

## Mejores Prácticas

### Código
- TypeScript estricto
- Componentes pequeños y reutilizables
- Separación de responsabilidades
- Nombres descriptivos

### Performance
- Lazy loading de rutas
- Memoización con useMemo/useCallback
- Optimización de re-renders

### Seguridad
- Validación en frontend y backend
- Autenticación JWT
- Aislamiento de datos por empresa
- Sanitización de entrada

## Testing

### Frontend
- Componentes con Storybook
- Tests unitarios con Jest
- Tests de integración con React Testing Library

### Backend
- Tests unitarios con Jest
- Tests de integración con Supertest
- Tests de base de datos con Prisma

## Deployment

### Frontend
- Build optimizado con Vite
- Deploy en Vercel/Netlify
- Variables de entorno configuradas

### Backend
- Deploy en Railway/Heroku
- Base de datos PostgreSQL
- Variables de entorno seguras

## Mantenimiento

### Código
- ESLint y Prettier configurados
- Commits convencionales
- Documentación actualizada

### Base de Datos
- Migraciones con Prisma
- Backups regulares
- Monitoreo de performance

## Roadmap

### Próximas Características
- [ ] Reportes avanzados
- [ ] Integración con APIs de proveedores
- [ ] Notificaciones en tiempo real
- [ ] App móvil
- [ ] Integración con sistemas de pago
