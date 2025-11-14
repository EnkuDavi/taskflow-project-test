export function success(data: any, message = 'Request successful') {
  if (data?.success !== undefined && data?.meta) {
    return data
  }

  return {
    success: true,
    message,
    data
  }
}
