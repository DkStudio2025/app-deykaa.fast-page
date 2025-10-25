# Deykaa - Sistema SaaS Seguro

Un sistema SaaS completo y seguro construido con Laravel (Backend) y Vue.js (Frontend), con operaciones CRUD y autenticación robusta.

## 🏗️ Arquitectura del Sistema

### Estructura del Proyecto
```
Laravel+Vuej/
├── index.html                 # Landing Page (Raíz)
├── backend/                   # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   └── DataController.php
│   │   └── Models/
│   │       └── Data.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── .env
└── frontend/                  # Aplicación Vue.js
    ├── src/
    │   ├── components/
    │   ├── views/
    │   │   ├── Login.vue
    │   │   ├── Dashboard.vue
    │   │   ├── DataList.vue
    │   │   └── DataForm.vue
    │   ├── stores/
    │   │   ├── auth.js
    │   │   └── data.js
    │   └── utils/
    │       └── api.js
    └── package.json
```

## 🚀 URLs del Sistema

- **Landing Page**: `https://app-deykaa.fast-page.org/` (Raíz)
- **Backend API**: `https://app-deykaa.fast-page.org/public/`
- **Frontend**: `https://app-deykaa.fast-page.org/`

## 🗄️ Base de Datos

- **Servidor**: `74.208.227.187:3306`
- **Usuario**: `root`
- **Contraseña**: `2742924@`
- **Base de datos**: `if0_38456049_969`

## 🔧 Configuración del Backend (Laravel)

### 1. Configuración de la Base de Datos
El archivo `.env` ya está configurado con las credenciales de la base de datos MySQL.

### 2. Migraciones Ejecutadas
```bash
cd backend
php artisan migrate --force
```

### 3. API Endpoints Disponibles

#### Autenticación
- `POST /api/register` - Registro de usuario
- `POST /api/login` - Inicio de sesión
- `POST /api/logout` - Cerrar sesión (requiere autenticación)
- `GET /api/me` - Obtener datos del usuario (requiere autenticación)

#### CRUD de Datos
- `GET /api/data` - Listar datos (requiere autenticación)
- `POST /api/data` - Crear dato (requiere autenticación)
- `GET /api/data/{id}` - Obtener dato específico (requiere autenticación)
- `PUT /api/data/{id}` - Actualizar dato (requiere autenticación)
- `DELETE /api/data/{id}` - Eliminar dato (requiere autenticación)

### 4. Características de Seguridad
- ✅ Autenticación con Laravel Sanctum
- ✅ Tokens de acceso seguros
- ✅ Validación de datos
- ✅ CORS configurado
- ✅ Middleware de autenticación
- ✅ Encriptación de contraseñas

## 🎨 Configuración del Frontend (Vue.js)

### 1. Instalación de Dependencias
```bash
cd frontend
npm install
```

### 2. Desarrollo
```bash
npm run dev
```

### 3. Producción
```bash
npm run build
```

### 4. Características del Frontend
- ✅ Vue 3 con Composition API
- ✅ Vue Router para navegación
- ✅ Pinia para gestión de estado
- ✅ Axios para peticiones HTTP
- ✅ Tailwind CSS para estilos
- ✅ Autenticación automática
- ✅ Interceptores de API
- ✅ Manejo de errores

## 📱 Vistas del Sistema

### 1. Landing Page (`index.html`)
- Diseño moderno y responsivo
- Información del producto
- Planes de precios
- Formulario de contacto
- Enlaces a la aplicación

### 2. Login (`/login`)
- Formulario de inicio de sesión
- Modal de registro
- Validación de formularios
- Manejo de errores

### 3. Dashboard (`/dashboard`)
- Estadísticas generales
- Datos recientes
- Acciones rápidas
- Navegación principal

### 4. Lista de Datos (`/data`)
- Tabla con todos los datos
- Filtros por categoría y estado
- Búsqueda en tiempo real
- Paginación
- Acciones de editar/eliminar

### 5. Formulario de Datos (`/data/new`, `/data/:id/edit`)
- Formulario completo de datos
- Validación en tiempo real
- Metadatos JSON
- Estados activo/inactivo

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. Usuario se registra o inicia sesión
2. Backend valida credenciales
3. Se genera token JWT con Laravel Sanctum
4. Token se almacena en localStorage
5. Todas las peticiones incluyen el token
6. Middleware valida el token en cada request

### Seguridad Implementada
- Contraseñas encriptadas con Hash
- Tokens de acceso seguros
- Expiración automática de sesiones
- Validación de datos en frontend y backend
- CORS configurado para dominios específicos

## 📊 Modelo de Datos

### Tabla `data`
```sql
- id (Primary Key)
- title (VARCHAR)
- description (TEXT, nullable)
- category (VARCHAR, nullable)
- metadata (JSON, nullable)
- is_active (BOOLEAN, default: true)
- user_id (Foreign Key)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Relaciones
- `data.user_id` → `users.id` (Cascade Delete)

## 🚀 Despliegue

### Backend (Laravel)
1. Subir archivos al servidor
2. Configurar `.env` con credenciales de producción
3. Ejecutar migraciones: `php artisan migrate --force`
4. Configurar servidor web (Apache/Nginx)

### Frontend (Vue.js)
1. Ejecutar build: `npm run build`
2. Subir archivos `dist/` al servidor
3. Configurar servidor web para SPA

## 🛠️ Comandos Útiles

### Backend
```bash
# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 📝 Notas Importantes

1. **Seguridad**: El sistema implementa múltiples capas de seguridad
2. **Escalabilidad**: Arquitectura preparada para crecimiento
3. **Mantenibilidad**: Código bien estructurado y documentado
4. **UX/UI**: Interfaz moderna y responsiva
5. **API**: RESTful con respuestas consistentes

## 🔧 Troubleshooting

### Problemas Comunes
1. **Error de CORS**: Verificar configuración en `config/cors.php`
2. **Token expirado**: El sistema redirige automáticamente al login
3. **Base de datos**: Verificar credenciales en `.env`
4. **Build fallido**: Verificar que todas las dependencias estén instaladas

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

---

**Deykaa** - Sistema SaaS Seguro y Confiable 🚀
