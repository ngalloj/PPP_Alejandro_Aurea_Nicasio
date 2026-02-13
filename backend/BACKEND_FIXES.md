# Backend Fixes - Integración con Frontend

## 🔰 PROBLEMA 1: JWT_SECRET Hardcodeado

### Archivo: `controllers/usuario.controller.js`
Línea 5

**Cambiar de:**
```javascript
const SECRET = 'admin1234';
```

**A:**
```javascript
const SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_aqui';
```

---

## 🔰 PROBLEMA 2: Crear archivo .env

### Archivo: `backend/.env`

**Crear este archivo si no existe:**
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASS=tu_contraseña_aqui
DB_NAME=veterinaria_db
DB_PORT=5432
JWT_SECRET=mi_secreto_jwt_super_seguro_2024
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4200
```

---

## 🔰 PROBLEMA 3: CORS Configuration

### Archivo: `app.js`

**Buscar la configuración de CORS y actualizarla a:**
```javascript
const cors = require('cors');

const corsOptions = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:4200', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

---

## 🔰 PROBLEMA 4: Requiere dotenv

### Archivo: `app.js` (en la parte superior)

**Añadir al inicio:**
```javascript
require('dotenv').config();
```

**Asegurarse que el paquete esté instalado:**
```bash
cd backend
npm install dotenv
```

---

## ✅ Pasos a ejecutar en orden:

1. **En terminal (dentro de carpeta backend):**
   ```bash
   npm install dotenv
   ```

2. **Crear archivo `.env` en backend/ con las variables de entorno**

3. **Actualizar `controllers/usuario.controller.js` línea 5**

4. **Actualizar `app.js` con dotenv y CORS correcto**

5. **Reiniciar servidor backend:**
   ```bash
   npm start
   ```

---

## 👋 Endpoint Login Confirmado

La ruta es correcta: `POST /api/usuarios/login` ✓

