import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { timeStamp } from '../timeStamp';

@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const responseMessage = exception.getResponse();
    const errorMessage: string =
      typeof responseMessage === 'object' ? (responseMessage as Record<string, string>).message : responseMessage;

    const errorResponse = {
      statusCode: exception.getStatus(),
      message: errorMessage,
      path: ctx.getRequest<Request>().url,
      timestamp: timeStamp(),
    };

    ctx.getResponse<Response>().setHeader('Skip-Logging', 'true');
    ctx.getResponse<Response>().status(exception.getStatus()).json(errorResponse);
  }
}
