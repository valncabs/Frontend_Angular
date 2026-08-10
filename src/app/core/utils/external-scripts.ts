const SCRIPT_TIMEOUT_MS = 10_000;

const pending = new Map<string, Promise<HTMLScriptElement>>();

/** Carga un script externo una sola vez por `src`. Si ya está cargado o en
 * curso, reusa la carga pendiente (varios componentes usan el mismo CDN sin
 * duplicarlo ni romper el global). Rechaza si hay timeout o error de red, para
 * que el consumidor no se quede esperando el mapa para siempre. */
export function loadExternalScript(src: string): Promise<HTMLScriptElement> {
  const inFlight = pending.get(src);
  if (inFlight) return inFlight;

  const promise = new Promise<HTMLScriptElement>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve(existing);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    const timer = setTimeout(() => {
      pending.delete(src);
      script.remove();
      reject(new Error(`Timeout cargando ${src}`));
    }, SCRIPT_TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timer);
      pending.delete(src);
      resolve(script);
    };
    script.onerror = () => {
      clearTimeout(timer);
      pending.delete(src);
      script.remove();
      reject(new Error(`No se pudo cargar ${src}`));
    };

    document.head.appendChild(script);
  });

  pending.set(src, promise);
  return promise;
}

/** Inyecta un stylesheet externo solo si aún no está en el documento. */
export function loadExternalStylesheet(href: string): void {
  if (document.querySelector<HTMLLinkElement>(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}
