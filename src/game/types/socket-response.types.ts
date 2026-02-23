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
}

export type SocketResponse<T = unknown> = SocketSuccessResponse<T> | SocketErrorResponse;

export class SocketResponseBuilder {
  static success<T>(message: T): SocketSuccessResponse<T> {
    return {
      success: true,
      message,
      timestamp: new Date(),
    };
  }

  static error(error: string, code?: string): SocketErrorResponse {
    return {
      success: false,
      error,
      code,
      timestamp: new Date(),
    };
  }

  static fromError(err: unknown, defaultMessage = 'Unknown error'): SocketErrorResponse {
    if (err instanceof Error) {
      return this.error(err.message, err.constructor.name);
    }

    return this.error(defaultMessage);
  }
}
