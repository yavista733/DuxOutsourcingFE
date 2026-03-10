# 🖥️ SICP Frontend — Dux Outsourcing
### Sistema Centralizado de Control Presupuestario

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss) ![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4)

---

## 📋 Descripción

Frontend del sistema SICP desarrollado para **Dux Outsourcing**, un Contact Center con más de 300 posiciones. El sistema permite gestionar el presupuesto por áreas, controlar el inventario de activos tecnológicos y automatizar el flujo de solicitudes de compra.

Este repositorio contiene **únicamente el Frontend (React)**. El Backend (Spring Boot) se encuentra en el repositorio del compañero de equipo.

---

## 🔗 Repositorios del Proyecto

| Parte | Repositorio |
|---|---|
| Frontend (React) | Este repositorio |
| Backend (Spring Boot) | https://github.com/yavista733/DUXOUTSOURCINGBE |

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| React 18 + Vite | Framework y bundler |
| React Router DOM | Navegación entre páginas |
| Axios | Peticiones HTTP al backend |
| Tailwind CSS v4 | Estilos y diseño |
| Recharts | Gráfico de barras del dashboard |
| Lucide React | Iconos |

---

## 📁 Estructura del Proyecto

```
src/
├── api/
│   └── axiosConfig.js        # Configuración de Axios + Interceptores JWT
├── context/
│   └── AuthContext.jsx       # Estado global de autenticación
├── components/
│   ├── Layout.jsx            # Layout principal con sidebar responsivo
│   ├── Sidebar.jsx           # Navegación lateral
│   └── ProtectedRoute.jsx    # Protección de rutas privadas
├── pages/
│   ├── Login.jsx             # Pantalla de inicio de sesión
│   ├── Dashboard.jsx         # Dashboard con KPIs y gráfico
│   ├── Solicitudes.jsx       # Módulo de solicitudes de compra
│   ├── Activos.jsx           # Módulo de activos TI
│   └── Areas.jsx             # Módulo de áreas y presupuesto
└── App.jsx                   # Definición de rutas
```

---

## 🚀 Cómo ejecutar el proyecto en una PC nueva

### ✅ Requisitos previos

- Tener instalado **Node.js v18 o superior** → [Descargar en nodejs.org](https://nodejs.org)
- Tener instalado **Git**
- Tener el **Backend corriendo** en `http://localhost:8080`

Verifica que Node esté instalado abriendo una terminal y ejecutando:
```bash
node --version
npm --version
```
Ambos deben mostrar un número de versión.

---

### 📥 Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPO_FRONTEND.git
cd TU_REPO_FRONTEND
```

---

### 📦 Paso 2 — Instalar dependencias

```bash
npm install
```

---

### ▶️ Paso 3 — Ejecutar el proyecto

```bash
npm run dev
```

Abre tu navegador en: **http://localhost:5173**

---

### 🔑 Credenciales de prueba

```
Usuario:    admin
Contraseña: 123456
```

---

## 📡 Conexión con el Backend

El frontend se conecta automáticamente al backend en `http://localhost:8080`.

Si necesitas cambiar la URL del backend, edita el archivo `src/api/axiosConfig.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:8080', // ← Cambia esta URL si es necesario
});
```

---

## 📌 Endpoints del Backend que consume el Frontend

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/areas` | Cargar áreas y presupuestos |
| PUT | `/api/areas/{id}` | Editar presupuesto anual |
| GET | `/api/solicitudes/area/{id}` | Listar solicitudes por área |
| POST | `/api/solicitudes` | Crear nueva solicitud |
| POST | `/api/solicitudes/{id}/aprobar` | Aprobar solicitud |
| POST | `/api/solicitudes/{id}/rechazar` | Rechazar solicitud |
| GET | `/api/activos/area/{id}` | Listar activos por área |
| POST | `/api/activos` | Registrar nuevo activo |

---

## 🖼️ Módulos del Sistema

### 🔐 Login
- Autenticación con usuario y contraseña
- Almacenamiento del token JWT en localStorage
- Redirección automática al Dashboard tras login exitoso

### 📊 Dashboard
- 4 tarjetas KPI: Presupuesto Total, Saldo Restante, Solicitudes Pendientes, Total Activos
- Gráfico de barras: Presupuesto Gastado vs Restante por área
- Tabla de solicitudes recientes

### 📋 Solicitudes de Compra
- Listado completo de solicitudes de las 3 áreas
- Filtros por estado: Todos, Pendiente, Aprobada, Rechazada
- Botones Aprobar / Rechazar para solicitudes pendientes
- Modal para crear nueva solicitud

### 💻 Activos TI
- Inventario de hardware y software
- Tarjetas resumen: Total, Hardware/Software, Disponibles
- Filtros por tipo: Todos, Hardware, Software
- Modal para registrar nuevo activo

### 💰 Áreas y Presupuesto
- Tarjetas por área con barra de progreso de consumo
- Indicador visual: verde (< 50%), amarillo (50-80%), rojo (> 80%)
- Tabla resumen con montos gastado y disponible
- Modal para editar el presupuesto anual

---

## ⚠️ Problemas conocidos y soluciones

### Error: "Usuario o contraseña incorrectos" después de reiniciar el backend

El backend genera una nueva clave secreta JWT cada vez que se reinicia, invalidando los tokens anteriores.

**Solución:** Abre el navegador, presiona F12 → Console y ejecuta:
```javascript
localStorage.clear()
```
Luego recarga la página e inicia sesión de nuevo.

**Solución definitiva (backend):** Fijar la clave secreta JWT en `application.properties`:
```properties
jwt.secret=TU_CLAVE_SECRETA_FIJA_AQUI
```

---

## 📅 Estado del Proyecto

**MVP completado** — Semana 6 de 10

| Módulo | Estado |
|---|---|
| Login + JWT | ✅ Completado |
| Dashboard + Gráfico | ✅ Completado |
| Layout responsivo | ✅ Completado |
| Módulo Solicitudes | ✅ Completado |
| Módulo Activos TI | ✅ Completado |
| Áreas y Presupuesto | ✅ Completado |
| Control por roles (ADMIN/APROBADOR/SOLICITANTE) | ⏳ Pendiente |
| Gestión de usuarios | ⏳ Pendiente |

---

## 👥 Equipo

| Rol | Responsable |
|---|---|
| Frontend (React) | Tu nombre |
| Backend (Spring Boot + MySQL) | Nombre de tu compañero |

---

*Proyecto académico — 6to Ciclo, Desarrollo de Software · Dux Outsourcing*
