export function formatValidationError(error: any) {
  let parsed = error;
  if (typeof error.message === 'string') {
    try {
      parsed = JSON.parse(error.message);
    } catch {
      parsed = error;
    }
  }

  const errorList: Array<{ field: string; error: string[] }> = [];
  if (parsed?.errors && Array.isArray(parsed.errors) && parsed.errors.length > 0) {
    for (const e of parsed.errors) {
      const field = e.path || 'field';
      const message = e.message || e.summary || 'Invalid value';

      errorList.push({
        field,
        error: [message]
      });
    }
  }

  if (errorList.length === 0) {
    const msg =
      parsed?.message ||
      parsed?.summary ||
      error?.message ||
      'Invalid request';

    errorList.push({
      field: 'field',
      error: [msg]
    });
  }

  return {
    success: false,
    message: 'Validation failed',
    errors: errorList
  };
}
