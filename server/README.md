# TravelPro Backend

## Descripción
Backend API para el sistema de gestión de viajes TravelPro, construido con Node.js, Express y Prisma.

## Arquitectura

### Estructura del Proyecto
```
server/
├── config/              # Configuración de la aplicación
│   ├── database.js      # Configuración de base de datos
│   ├── validation.js    # Esquemas de validación Zod
│   └── index.js         # Configuración principal
├── controllers/         # Controladores de la API
│   ├── base.controller.js
│   ├── auth.controller.js
│   ├── client.controller.js
│   └── passenger.controller.js
├── middleware/          # Middleware personalizado
│   ├── auth.js         # Autenticación JWT
│   ├── error.js        # Manejo de errores
│   └── validation.js   # Validación de datos
├── routes/             # Rutas de la API
│   ├── auth.routes.js
│   ├── client.routes.js
│   └── passenger.routes.js
├── services/           # Lógica de negocio
│   ├── base.service.js
│   ├── auth.service.js
│   ├── client.service.js
│   └── passenger.service.js
├── utils/              # Utilidades
│   ├── response.js     # Respuestas estandarizadas
│   └── logger.js       # Sistema de logging
├── prisma/             # Esquema y migraciones de BD
├── app.js              # Configuración de Express
└── index.js            # Punto de entrada
```

## Características

### 🔐 Autenticación y Autorización
- JWT tokens para autenticación
- Middleware de autenticación
- Verificación de roles y permisos
- Multi-tenancy por empresa

### 📊 Base de Datos
- PostgreSQL con Prisma ORM
- Migraciones automáticas
- Conexión centralizada
- Logging de consultas en desarrollo

### ✅ Validación
- Esquemas Zod centralizados
- Validación de entrada automática
- Mensajes de error estandarizados
- Validación multi-tenant

### 🛡️ Seguridad
- Helmet para headers de seguridad
- CORS configurado
- Rate limiting
- Sanitización de entrada
- Logging de seguridad

### 📝 Logging
- Winston para logging estructurado
- Diferentes niveles de log
- Rotación de archivos
- Logging de consultas SQL

## Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### Pasos
1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd travelpro/server
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Configurar base de datos**
   ```bash
   # Crear base de datos PostgreSQL
   createdb travelpro_db
   
   # Ejecutar migraciones
   npm run prisma:migrate
   
   # Generar cliente Prisma
   npm run prisma:generate
   ```

5. **Poblar base de datos (opcional)**
   ```bash
   npm run seed
   ```

6. **Iniciar servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/profile` - Actualizar perfil
- `POST /api/auth/logout` - Cerrar sesión

### Clientes
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obtener cliente
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente
- `GET /api/clients/search?q=query` - Buscar clientes

### Pasajeros
- `GET /api/passengers` - Listar pasajeros
- `GET /api/passengers/:id` - Obtener pasajero
- `POST /api/passengers` - Crear pasajero
- `PUT /api/passengers/:id` - Actualizar pasajero
- `DELETE /api/passengers/:id` - Eliminar pasajero
- `GET /api/passengers/search?q=query` - Buscar pasajeros

## Configuración

### Variables de Entorno
```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://username:password@localhost:5432/travelpro_db"
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=1d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
BCRYPT_ROUNDS=12
```

### Base de Datos
- **Motor**: PostgreSQL
- **ORM**: Prisma
- **Migraciones**: Automáticas
- **Seeds**: Incluidos

## Desarrollo

### Estructura de Servicios
```javascript
// Ejemplo de servicio
export class ClientService extends BaseService {
  constructor() {
    super("client");
  }

  async getAll(companyId, options = {}) {
    // Implementación específica
  }
}
```

### Estructura de Controladores
```javascript
// Ejemplo de controlador
export const clientController = {
  getAll: baseController.getAll,
  create: [validate(clientSchemas.create), baseController.create],
  // ...
};
```

### Validación
```javascript
// Esquemas de validación
export const clientSchemas = {
  create: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().optional(),
    // ...
  }),
};
```

## Testing

### Ejecutar Tests
```bash
npm test
```

### Coverage
```bash
npm run test:coverage
```

## Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run prisma:generate
EXPOSE 3001
CMD ["npm", "start"]
```

### Variables de Producción
- `NODE_ENV=production`
- `DATABASE_URL` configurada
- `JWT_SECRET` seguro
- `CORS_ORIGIN` específico

## Monitoreo

### Health Check
- `GET /health` - Estado del servidor

### Logs
- Archivos en `logs/`
- Rotación automática
- Diferentes niveles

### Métricas
- Tiempo de respuesta
- Errores por endpoint
- Uso de base de datos

## Contribución

### Estándares de Código
- ESLint configurado
- Prettier para formato
- Commits convencionales
- Tests obligatorios

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature
3. Implementar cambios
4. Agregar tests
5. Crear pull request

## Licencia
MIT License
