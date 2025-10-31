export const SUCCESS = (data: any, message: string = 'Success') => ({
  statusCode: 200,
  message,
  data,
});

export const CREATED = (data: any, message: string = 'Created successfully') => ({
  statusCode: 201,
  message,
  data,
});

export const NOT_FOUND = (message: string = 'Resource not found') => ({
  statusCode: 404,
  message,
  error: 'Not Found',
});

export const BAD_REQUEST = (message: string = 'Bad request') => ({
  statusCode: 400,
  message,
  error: 'Bad Request',
});

export const UNAUTHORIZED = (message: string = 'Unauthorized') => ({
  statusCode: 401,
  message,
  error: 'Unauthorized',
});

export const FORBIDDEN = (message: string = 'Forbidden') => ({
  statusCode: 403,
  message,
  error: 'Forbidden',
});

export const CONFLICT = (message: string = 'Conflict') => ({
  statusCode: 409,
  message,
  error: 'Conflict',
});

export const INTERNAL_SERVER_ERROR = (message: string = 'Internal server error') => ({
  statusCode: 500,
  message,
  error: 'Internal Server Error',
});

