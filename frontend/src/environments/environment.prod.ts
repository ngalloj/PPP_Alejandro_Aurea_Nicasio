// src/environments/environment.prod.ts
// ----------------------------------------------------------
// Configuración para PRODUCCIÓN (build que subes a Netlify)
// Apunta al backend desplegado en Render
// ----------------------------------------------------------

export const environment = {
  production: true,
  // URL base del backend en Render (sin barra final)
  apiUrl: 'https://ppp-alejandro-aurea-nicasio.onrender.com/api'
};
