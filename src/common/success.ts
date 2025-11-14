export function success(data: any, message = 'Request successful') {
  return {
    success: true,
    message,
    data
  }
}
