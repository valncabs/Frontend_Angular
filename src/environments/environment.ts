export const environment = {
  production: true,
  apiUrl: 'https://back-petcentric.onrender.com',
  // El asistente IA (/ask) corre en el mismo backend de producción; a su vez
  // ese backend alcanza mcpo (en tu PC) mediante un túnel. Cambia esta URL
  // si el backend cambia de dominio o dejas de usar Render para el chat.
  chatApiUrl: 'https://back-petcentric.onrender.com',
};
