import { AppError } from './error'
import { formatValidationError } from './validation'

export function createErrorHandler() {
  return ({ code, error }: any) => {
    if (code === 'PARSE') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Validation failed',
          errors: [
            {
              field: 'root',
              error: ['Request body is required']
            }
          ]
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (code === 'VALIDATION') {
      return new Response(
        JSON.stringify(formatValidationError(error)),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (error instanceof AppError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message
        }),
        { status: error.status }
      )
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error'
      }),
      { status: 500 }
    )
  }
}
