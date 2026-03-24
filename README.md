# 🖥️ SICP Frontend — Dux Outsourcing
### Sistema Centralizado de Control Presupuestario
 
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss) ![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4) ![Sonner](https://img.shields.io/badge/Sonner-Toast-black) ![JWT](https://img.shields.io/badge/JWT--Decode-4.x-orange)
 
---
 
## 📋 Descripción
 
Frontend del sistema SICP desarrollado para **Dux Outsourcing**, un Contact Center con más de 300 posiciones. El sistema permite gestionar el presupuesto por áreas, controlar el inventario de activos tecnológicos, automatizar el flujo de solicitudes de compra y gestionar usuarios con control de roles.
 
> ✅ **MVP Completado — Sprint 3** — Contrato de APIs cerrado con el equipo Backend.
 
---
 
## 🔗 Repositorios del Proyecto
 
| Parte | Repositorio |
|---|---|
| 🖥️ Frontend (React) | Este repositorio |
| ⚙️ Backend (Spring Boot) | https://github.com/yavista733/DUXOUTSOURCINGBE |
 
---
 
## 🛠️ Stack Tecnológico
 
| Tecnología | Versión | Uso |
|---|---|---|
| React + Vite | 18 + 5.x | Framework principal y bundler |
| React Router DOM | 6.x | Navegación entre páginas (SPA) |
| Axios | 1.x | Peticiones HTTP con interceptores JWT |
| Tailwind CSS | v4 | Estilos utilitarios y diseño responsivo |
| Recharts | 2.x | Gráfico de barras del dashboard |
| Lucide React | 0.38x | Iconos SVG |
| jwt-decode | 4.x | Decodificar token JWT para leer rol y areaId |
| Sonner | Latest | Notificaciones toast en toda la app |
 
---
 
## 📦 Instalación de Dependencias
 
```bash
# Dependencias principales
npm install react-router-dom axios
 
# Estilos
npm install -D tailwindcss postcss autoprefixer @tailwindcss/vite
 
# Gráficos
npm install recharts
 
# JWT
npm install jwt-decode
 
# Notificaciones
npm install sonner
 
# Iconos
npm install lucide-react
```
 
---
 
## 📁 Estructura del Proyecto
 
```
src/
├── api/
│   └── axiosConfig.js          # Axios + interceptores JWT automáticos
├── context/
│   └── AuthContext.jsx         # Estado global: token, usuario, rol, login/logout
├── components/
│   ├── Layout.jsx              # Wrapper responsivo con Sidebar + Topbar
│   ├── Sidebar.jsx             # Navegación lateral con links activos
│   └── ProtectedRoute.jsx      # Bloquea rutas privadas sin token
├── pages/
│   ├── Login.jsx               # Autenticación con manejo de errores
│   ├── Dashboard.jsx           # KPIs, gráfico y solicitudes recientes
│   ├── Solicitudes.jsx         # CRUD solicitudes + aprobar/rechazar + filtros
│   ├── Activos.jsx             # Inventario activos TI + edición
│   ├── Areas.jsx               # Saldos por área + editar presupuesto
│   └── Configuracion.jsx       # Gestión de usuarios (solo ADMIN)
└── App.jsx                     # Rutas de la aplicación + Toaster global
```
 
---
 
## 🚀 Cómo ejecutar el proyecto en una PC nueva
 
### ✅ Requisitos previos
 
- **Node.js v18 o superior** → [Descargar en nodejs.org](https://nodejs.org)
- **Git** instalado
- **Backend corriendo** en `http://localhost:8080`
 
Verifica Node:
```bash
node --version
npm --version
```
 
### 📥 Paso 1 — Clonar el repositorio
 
```bash
git clone https://github.com/yavista733/DuxOutsourcingFE.git
cd DuxOutsourcingFE
```
 
### 📦 Paso 2 — Instalar dependencias
 
```bash
npm install
```
 
### ▶️ Paso 3 — Ejecutar el proyecto
 
```bash
npm run dev
```
 
Abre tu navegador en: **http://localhost:5173**
 
---
 
## 🔑 Credenciales de prueba
 
| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `123456` |
 
---
 
## 📡 Conexión con el Backend
 
El frontend se conecta al backend en `http://localhost:8080`. Para cambiar esta URL edita `src/api/axiosConfig.js`:
 
```js
const api = axios.create({
  baseURL: 'http://localhost:8080', // ← Cambia aquí si es necesario
});
```
 
---
 
## 🔐 Flujo de Seguridad JWT
 
El frontend implementa un flujo completo de autenticación:
 
1. **Login** → `POST /api/auth/login` → guarda el token en `localStorage`
2. **jwt-decode** → decodifica el token para extraer `rol` y `areaId`
3. **Interceptor Axios** → adjunta `Authorization: Bearer <token>` en cada petición
4. **Verificación al recargar** → `GET /api/usuarios/me` valida el token al hacer F5
5. **Rutas protegidas** → `<ProtectedRoute>` redirige al login si no hay token válido
6. **Control de roles** → `isAdmin` e `isAprobador` controlan botones y módulos visibles
 
---
 
## 🖼️ Módulos del Sistema
 
### 🔐 Login
- Formulario de autenticación con manejo de errores visuales
- Redirección automática al Dashboard tras login exitoso
 
### 📊 Dashboard
- 4 KPIs: Presupuesto Total, Saldo Restante, Solicitudes Pendientes, Activos TI
- Gráfico de barras: Gastado vs Restante por área (Recharts)
- Tabla de últimas 5 solicitudes recientes
 
### 📋 Solicitudes de Compra
- ADMIN → ve todas las solicitudes (`GET /api/solicitudes`)
- Otros roles → ven solo su área (`GET /api/solicitudes/area/{id}`)
- Filtros por estado: Todos, Pendiente, Aprobada, Rechazada
- Botones Aprobar/Rechazar visibles solo para ADMIN y APROBADOR
- Modal para crear nueva solicitud
 
### 💻 Activos TI
- ADMIN → ve todos los activos (`GET /api/activos`)
- Otros roles → ven solo su área (`GET /api/activos/area/{id}`)
- Filtros por tipo: Todos, Hardware, Software
- Edición de activos: nombre, serie, tipo, estado y área
- Modal para registrar nuevo activo
 
### 💰 Áreas y Presupuesto
- Tarjetas por área con barra de progreso de consumo
- Indicador visual: verde < 50%, amarillo 50-80%, rojo > 80%
- Tabla resumen con montos gastado y disponible en soles (S/)
- Modal para editar el presupuesto anual
 
### ⚙️ Configuración (solo ADMIN)
- Tabla de usuarios con avatar, nombre, email, área, rol y estado
- Crear nuevo usuario con todos los campos requeridos
- Editar nombre, email, rol y área de usuarios existentes
- Activar/Desactivar usuarios (baja lógica sin eliminar registros)
- Protección: el botón Desactivar está oculto para usuarios ADMIN
 
---
 
## 📡 Contrato de APIs Completo
 
| Método | Endpoint | Módulo | Sprint |
|---|---|---|---|
| POST | `/api/auth/login` | Login | S1 |
| GET | `/api/areas` | Dashboard, Áreas | S1 |
| PUT | `/api/areas/{id}` | Áreas | S1 |
| GET | `/api/solicitudes/area/{id}` | Solicitudes | S1 |
| POST | `/api/solicitudes` | Solicitudes | S1 |
| POST | `/api/solicitudes/{id}/aprobar` | Solicitudes | S1 |
| POST | `/api/solicitudes/{id}/rechazar` | Solicitudes | S1 |
| GET | `/api/activos/area/{id}` | Activos | S1 |
| POST | `/api/activos` | Activos | S1 |
| GET | `/api/dashboard/kpis` | Dashboard | S2 |
| GET | `/api/dashboard/grafico-areas` | Dashboard | S2 |
| GET | `/api/solicitudes/recientes` | Dashboard | S2 |
| GET | `/api/usuarios/me` | AuthContext | S2 |
| GET | `/api/usuarios` | Configuración | S2 |
| POST | `/api/usuarios` | Configuración | S2 |
| PUT | `/api/usuarios/{id}` | Configuración | S3 |
| PATCH | `/api/usuarios/{id}/estado` | Configuración | S3 |
| GET | `/api/solicitudes` | Solicitudes (ADMIN) | S3 |
| GET | `/api/activos` | Activos (ADMIN) | S3 |
| PUT | `/api/activos/{id}` | Activos | S3 |
 
---
 
## 🔔 Notificaciones Toast (Sonner)
 
El sistema usa Sonner para mostrar feedback visual en todas las acciones:
 
- ✅ **Verde** — operaciones exitosas (aprobar, crear, editar, activar)
- ❌ **Rojo** — errores de servidor o validación
 
Configurado globalmente en `App.jsx`:
```jsx
<Toaster position="top-right" richColors duration={3000} />
```
 
---
 
## ⚠️ Solución al problema de token vencido
 
Cuando el backend se reinicia, los tokens anteriores quedan inválidos. El sistema lo maneja automáticamente:
 
- Al recargar la página el `AuthContext` llama a `GET /api/usuarios/me`
- Si responde 401 → limpia localStorage y redirige al login automáticamente
- Si responde 200 → la sesión continúa normalmente sin interrupciones
 
Para limpiar manualmente desde la consola del navegador (F12):
```javascript
localStorage.clear()
```
 
**Solución definitiva (backend):** Fijar la clave secreta JWT en `application.properties`:
```properties
jwt.secret=TU_CLAVE_SECRETA_FIJA_AQUI
```
 
---
 
## 📅 Historial de Sprints
 
### Sprint 1 — Base del MVP
- Login, Dashboard, Solicitudes, Activos TI, Áreas y Presupuesto
- Layout responsivo con Sidebar y Topbar
- Integración JWT para rutas protegidas
 
### Sprint 2 — Roles y Endpoints Dedicados
- JWT enriquecido con `rol` y `areaId` usando `jwt-decode`
- Dashboard refactorizado con 3 endpoints dedicados del backend
- Verificación de sesión al recargar con `GET /api/usuarios/me`
- Módulo de Configuración para gestión de usuarios
 
### Sprint 3 — CRUD Completo y Cierre del MVP ✅
- CRUD completo de usuarios: editar + activar/desactivar
- CRUD completo de activos: editar + vista global para ADMIN
- Vista global de solicitudes y activos para rol ADMIN
- Notificaciones toast con Sonner en todos los módulos
- Fix de CORS para método PATCH coordinado con equipo backend
 
---
 
## 👥 Equipo
 
| Rol | Responsable |
|---|---|
| Frontend (React) | Shairf Ramirez |
| Backend (Spring Boot + MySQL) | Compañero Backend |
 
---
 
*Proyecto académico — 6to Ciclo, Desarrollo de Software · Dux Outsourcing · SICP v1.0.0*
