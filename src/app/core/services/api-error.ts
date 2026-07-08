import { HttpErrorResponse } from '@angular/common/http';

export interface ApiFieldErrors {
  message: string;
  fieldErrors: Record<string, string>;
}

/** Traduce el envelope de error del backend ({success, message, errors})
 * a algo directamente usable por fieldError() en cada formulario. */
export function parseApiError(error: HttpErrorResponse): ApiFieldErrors {
  const body = error.error as { message?: string; errors?: Record<string, string[]> };
  const fieldErrors: Record<string, string> = {};

  if (body?.errors) {
    for (const [field, messages] of Object.entries(body.errors)) {
      fieldErrors[field] = messages[0];
    }
  }

  return {
    message: body?.message ?? 'Ocurrió un error inesperado. Intenta de nuevo.',
    fieldErrors,
  };
}
