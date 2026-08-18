export const environment = {
  production: true,
  apiUrl: 'https://back-petcentric.onrender.com',
  // El asistente IA (endpoint /ask) se mantiene local por el momento:
  // requiere que tu backend FastAPI corra en la máquina que aloja mcpo.
  chatApiUrl: 'http://127.0.0.1:8081',
};
