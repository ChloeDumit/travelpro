# Servicios de API - Arquitectura Escalable

## 🏗️ **Arquitectura General**

Este sistema implementa una arquitectura de servicios organizados por dominio, proporcionando una capa de abstracción entre los componentes de React y la API del servidor.

```
src/
├── lib/
│   ├── api.ts                 # Cliente HTTP base con autenticación automática
│   └── services/              # Servicios organizados por dominio
│       ├── auth.service.ts    # Autenticación y usuarios
│       ├── sales.service.ts   # Ventas y transacciones
│       ├── clients.service.ts # Gestión de clientes
│       ├── suppliers.service.ts # Gestión de proveedores
│       ├── operators.service.ts # Gestión de operadores
│       ├── classifications.service.ts # Clasificaciones y categorías
│       └── payments.service.ts # Pagos y transacciones
├── hooks/
│   ├── useApi.ts              # Hook base para peticiones HTTP
│   └── services/              # Hooks específicos para cada servicio
└── components/                 # Componentes que usan los hooks
```

## 🚀 **Características Principales**

### **1. Cliente HTTP Inteligente (`api.ts`)**
- ✅ Autenticación automática con JWT
- ✅ Manejo automático de errores 401 (redirige a login)
- ✅ Tipado TypeScript completo
- ✅ Headers automáticos para todas las peticiones

### **2. Servicios Organizados por Dominio**
- ✅ **Separación de responsabilidades**: Cada servicio maneja un dominio específico
- ✅ **Interfaces tipadas**: Todas las operaciones tienen tipos TypeScript
- ✅ **Consistencia**: Misma estructura para todos los servicios
- ✅ **Reutilización**: Los servicios pueden ser usados en múltiples componentes

### **3. Hooks Personalizados (`useApi`)**
- ✅ **Estados integrados**: `loading`, `error`, `data`
- ✅ **Manejo de errores**: Callbacks de éxito y error
- ✅ **Reintentos automáticos**: Lógica de reintento integrada
- ✅ **Optimización**: Prevención de re-renders innecesarios

## 📚 **Uso de Servicios**

### **Importación de Servicios**

```typescript
// Importar un servicio específico
import { authService } from "../lib/services/auth.service";
import { salesService } from "../lib/services/sales.service";

// O importar todos los servicios
import * as services from "../lib/services";
```

### **Uso Directo de Servicios**

```typescript
// En componentes o funciones
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await authService.login(credentials);
    if (response.data) {
      // Manejar respuesta exitosa
      console.log(response.data.user);
    }
  } catch (error) {
    // Manejar error
    console.error("Login failed:", error);
  }
};
```

## 🎣 **Uso de Hooks de Servicios**

### **Hook de Autenticación**

```typescript
import { useAuth } from "../hooks/services/useAuth";

function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (formData: LoginCredentials) => {
    await login.execute(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
      {login.loading && <span>Cargando...</span>}
      {login.error && <span className="error">{login.error}</span>}
    </form>
  );
}
```

### **Hook de Ventas**

```typescript
import { useSales } from "../hooks/services/useSales";

function SalesList() {
  const { getAll, getStats } = useSales();
  
  useEffect(() => {
    getAll.execute();
    getStats.execute();
  }, []);

  if (getAll.loading) return <div>Cargando ventas...</div>;
  if (getAll.error) return <div>Error: {getAll.error}</div>;

  return (
    <div>
      {getAll.data?.sales?.map(sale => (
        <SaleCard key={sale.id} sale={sale} />
      ))}
    </div>
  );
}
```

### **Hook de Clientes**

```typescript
import { useClients } from "../hooks/services/useClients";

function ClientForm() {
  const { create, update } = useClients();
  
  const handleSubmit = async (clientData: CreateClientData) => {
    if (isEditing) {
      await update.execute(clientId, clientData);
    } else {
      await create.execute(clientData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
      {(create.loading || update.loading) && <span>Guardando...</span>}
      {(create.error || update.error) && (
        <span className="error">{create.error || update.error}</span>
      )}
    </form>
  );
}
```

## 🔧 **Configuración y Personalización**

### **Variables de Entorno**

```bash
# .env
VITE_API_URL=http://localhost:3001
```

### **Personalización de Headers**

```typescript
// En api.ts
private getHeaders(): HeadersInit {
  const token = localStorage.getItem("auth_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Custom-Header": "value", // Headers personalizados
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
```

### **Manejo de Errores Personalizado**

```typescript
// En useApi.ts
const execute = useCallback(
  async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall(...args);
      
      if (response.data) {
        setState(prev => ({ ...prev, data: response.data, loading: false }));
        options.onSuccess?.(response.data);
      } else {
        throw new Error(response.message || "No data received");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      
      // Lógica personalizada de manejo de errores
      if (errorMessage.includes("Network")) {
        setState(prev => ({ ...prev, error: "Error de conexión", loading: false }));
      } else {
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      }
      
      options.onError?.(errorMessage);
    }
  },
  [apiCall, options.onSuccess, options.onError]
);
```

## 📈 **Escalabilidad y Mantenimiento**

### **Agregar Nuevos Servicios**

1. **Crear el archivo de servicio**:
```typescript
// src/lib/services/new-service.service.ts
import { api } from "../api";

export interface NewEntity {
  id: string;
  name: string;
  // ... otras propiedades
}

export const newService = {
  getAll: () => api.get<{ entities: NewEntity[] }>("/api/new-entities"),
  getById: (id: string) => api.get<NewEntity>(`/api/new-entities/${id}`),
  create: (data: Partial<NewEntity>) => 
    api.post<{ message: string; entity: NewEntity }>("/api/new-entities", data),
  // ... otros métodos
};
```

2. **Crear el hook correspondiente**:
```typescript
// src/hooks/services/useNewService.ts
import { useApi } from "../useApi";
import { newService } from "../../lib/services/new-service.service";

export const useNewService = () => {
  const getAll = useApi(newService.getAll);
  const getById = useApi(newService.getById);
  const create = useApi(newService.create);
  
  return { getAll, getById, create };
};
```

3. **Exportar desde el índice**:
```typescript
// src/lib/services/index.ts
export * from "./new-service.service";

// src/hooks/services/index.ts
export * from "./useNewService";
```

### **Patrones de Uso Recomendados**

#### **1. Manejo de Estados de Carga**
```typescript
function DataComponent() {
  const { getAll } = useSales();
  
  // Estado de carga global
  if (getAll.loading) {
    return <LoadingSpinner />;
  }
  
  // Estado de error
  if (getAll.error) {
    return <ErrorMessage error={getAll.error} onRetry={() => getAll.execute()} />;
  }
  
  // Datos cargados
  return <DataList data={getAll.data} />;
}
```

#### **2. Operaciones con Callbacks**
```typescript
function CreateForm() {
  const { create } = useSales();
  
  const handleSubmit = async (formData: CreateSaleData) => {
    await create.execute(formData, {
      onSuccess: (data) => {
        toast.success("Venta creada exitosamente");
        navigate(`/sales/${data.sale.id}`);
      },
      onError: (error) => {
        toast.error(`Error al crear venta: ${error}`);
      }
    });
  };
}
```

#### **3. Reutilización de Servicios**
```typescript
// En múltiples componentes
function SalesDashboard() {
  const { getStats, getSalesOverview } = useSales();
  // ... lógica del dashboard
}

function SalesReport() {
  const { getStats, getSalesOverview } = useSales();
  // ... lógica del reporte
}
```

## 🧪 **Testing**

### **Mocking de Servicios**

```typescript
// __mocks__/services/auth.service.ts
export const authService = {
  login: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
};

// En tests
jest.mock("../lib/services/auth.service");
import { authService } from "../lib/services/auth.service";

test("should handle login success", async () => {
  authService.login.mockResolvedValue({
    data: { user: mockUser, token: "mock-token" }
  });
  
  // ... test logic
});
```

### **Testing de Hooks**

```typescript
import { renderHook, act } from "@testing-library/react";
import { useSales } from "../hooks/services/useSales";

test("should fetch sales on mount", async () => {
  const { result } = renderHook(() => useSales());
  
  await act(async () => {
    await result.current.getAll.execute();
  });
  
  expect(result.current.getAll.data).toBeDefined();
});
```

## 🚨 **Solución de Problemas Comunes**

### **Error 401 - No autorizado**
- Verificar que el token esté presente en localStorage
- El sistema redirige automáticamente a login
- Verificar que el token no haya expirado

### **Error de CORS**
- Verificar la URL de la API en las variables de entorno
- Asegurar que el servidor permita requests desde el origen correcto

### **Datos no se cargan**
- Verificar que el hook esté siendo llamado con `.execute()`
- Revisar la consola para errores de red
- Verificar que el servicio esté exportado correctamente

### **Re-renders excesivos**
- Usar `useCallback` para funciones que se pasan como props
- Verificar que las dependencias de `useEffect` sean correctas
- Usar `React.memo` para componentes que no necesitan re-renderizarse

## 📚 **Recursos Adicionales**

- [Documentación de React Hooks](https://react.dev/reference/react/hooks)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JWT Authentication](https://jwt.io/introduction)

---

**¿Necesitas ayuda?** Revisa la consola del navegador para errores específicos o consulta la documentación de la API del servidor.
