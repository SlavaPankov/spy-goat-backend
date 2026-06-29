export interface SocketSuccessResponse<T = unknown> {
  success: true;
  message: T;
  timestamp?: Date;
}

export interface SocketErrorResponse {
  success: false;
  error: string;
  code?: string;
  timestamp?: Date;
  data?: unknown;
}

export class SocketResponseBuilder {
  static success<T>(message: T): SocketSuccessResponse<T> {
    return {
      success: true,
      message,
      timestamp: new Date(),
    };
  }

  static error(error: string, code?: string, data?: unknown): SocketErrorResponse {
    return {
      success: false,
      error,
      code,
      data,
      timestamp: new Date(),
    };
  }

  static fromError(err: unknown, defaultMessage = 'Unknown error', data?: unknown): SocketErrorResponse {
    if (err instanceof Error) {
      return this.error(err.message, err.constructor.name, data);
    }

    return this.error(defaultMessage, undefined, data);
  }
}
