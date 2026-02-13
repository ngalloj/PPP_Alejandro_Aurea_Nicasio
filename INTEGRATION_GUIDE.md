# Guía de Integración - Clínica Veterinaria

## 🚢 Estado Actual del Proyecto

**Backend:** ✅ API completa con soporte para 4 roles (admin, veterinario, recepcionista, cliente)
**Frontend:** ✅ Ionic + Angular con componentes standalone
**Authenticación:** 📔 Necesita integración backend-frontend
**Dashboard Recepcionista:** 📤 Pendiente de crear

---

## 🔷‍♀️ Rol Recepcionista - Funcionalidades

### Qué puede hacer un recepcionista:
- ✅ Ver todas las citas del día
- ✅ Crear nuevas citas (solo para clientes)
- ✅ Actualizar estado de citas
- ✅ Ver información del animal y cliente
- ✅ Registrar nuevos clientes
- ❌ No puede modificar usuarios ni borrarlos
- ❌ No puede ver facturación

### Endpoints que usa:
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/citas` - Obtener todas las citas
- `POST /api/citas` - Crear nueva cita
- `PUT /api/citas/:id` - Actualizar cita
- `GET /api/usuarios` - Buscar clientes
- `POST /api/usuarios` - Registrar nuevo cliente

---

## 🚀 Pasos de Integración - ORDEN IMPORTANTE

### Paso 1: Backend - Configurar variables de entorno (5 min)

**Archivo:** `backend/.env`
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASS=tu_contraseña
DB_NAME=veterinaria_db
DB_PORT=5432
JWT_SECRET=tu_secreto_super_seguro_2024
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4200
```

**Archivo:** `backend/controllers/usuario.controller.js` (Línea 5)
```javascript
// CAMBIAR:
const SECRET = 'admin1234';

// A:
const SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_aqui';
```

**Archivo:** `backend/app.js` (Inicio)
```javascript
require('dotenv').config();
```

**Terminal:**
```bash
cd backend
npm install dotenv
npm start
```

### Paso 2: Frontend - Verificar Auth Service (10 min)

**Revisar:** `src/app/services/auth.service.ts`

Debe tener:
- Método `login(email, password)`
- Método `saveToken(token)`
- Método `getUserRole()` - decodifica JWT para obtener el rol
- Método `logout()`

**Terminal:**
```bash
cd frontend
npm install
ng serve
```

### Paso 3: Probar Login (10 min)

**URL:** http://localhost:4200

**Credenciales de prueba** (crear si no existen en BD):
- Admin: admin@clinic.com / admin123
- Veterinario: vet@clinic.com / vet123
- **Recepcionista:** receptionist@clinic.com / receptionist123
- Cliente: client@clinic.com / client123

### Paso 4: Crear Dashboard Recepcionista (15 min)

**Terminal (en carpeta frontend):**
```bash
ng generate component pages/citas-recepcionista
```

**Archivo generado:** `src/app/pages/citas-recepcionista/citas-recepcionista.page.ts`

ver plantilla en `FRONTEND_FIXES.md`

### Paso 5: Actualizar rutas (5 min)

**Archivo:** `src/app/app.routes.ts`

```typescript
import { CitasRecepcionistaPage } from './pages/citas-recepcionista/citas-recepcionista.page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'citas-recepcionista',
    component: CitasRecepcionistaPage
  },
  // ... otras rutas
];
```

### Paso 6: Testing End-to-End (20 min)

1. Ir a `http://localhost:4200/login`
2. Ingresar credenciales de recepcionista
3. Debe redirigir a `/citas-recepcionista`
4. Ver lista de citas desde la API

---

## 📁 Documentación Detallada

Ver archivos:
- **`backend/BACKEND_FIXES.md`** - Todos los cambios necesarios en el backend
- **`frontend/FRONTEND_FIXES.md`** - Todos los cambios necesarios en el frontend

---

## 🖊️ Troubleshooting

### Error: "CORS error" en consola del navegador

**Solución:** Verificar `backend/app.js` tiene CORS configurado:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Error: "JWT_SECRET is undefined"

**Solución:** 
1. Verificar que `.env` existe en backend con `JWT_SECRET=...`
2. Ejecutar `npm install dotenv`
3. Verificar `app.js` tiene `require('dotenv').config()` al inicio

### Error: "Cannot POST /api/usuarios/login"

**Solución:** Verificar que el backend está ejecutándose en puerto 3000
```bash
netstat -an | grep 3000  # En Windows: netstat -ano | findstr :3000
```

### El login falla con credenciales correctas

**Solución:** 
1. Verificar en BD que el usuario existe
2. Verificar contraseña está hasheada con bcrypt
3. Ver logs del backend: `console.log()` en `usuario.controller.js`

---

## 📃 Flujo de Autenticación

```
User (Frontend)
    ↓ email + password
Login Component
    ↓ HTTP POST
Auth Service
    ↓
/api/usuarios/login (Backend)
    ↓ bcrypt.compare()
BD (Usuario)
    ↑ token JWT
Auth Service
    ↑ saveToken(JWT)
LocalStorage
    ↑ navigate('/citas-recepcionista')
Router
    ↑
Citas Dashboard (Cargado)
```

---

## ✅ Checklist Final

- [ ] Crear `.env` en backend
- [ ] Instalar `dotenv` en backend
- [ ] Actualizar `usuario.controller.js` línea 5
- [ ] Actualizar `app.js` con CORS correcto
- [ ] Verificar `auth.service.ts` está bien configurado
- [ ] Crear componente `citas-recepcionista`
- [ ] Actualizar rutas en `app.routes.ts`
- [ ] Probar login con credenciales de recepcionista
- [ ] Ver citas en el dashboard
- [ ] Logout funciona correctamente

---

**⚠️ IMPORTANTE:** El proyecto está usando **Ionic Framework**, NO Angular Material. Mantener esta arquitectura para compatibilidad con el código existente.

