import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.code) {
      case 'P2002':
        // Unique constraint violation
        status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[])?.join(', ') || 'field';
        message = `A record with this ${target} already exists`;
        break;

      case 'P2003':
        // Foreign key constraint violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Related record not found';
        break;

      case 'P2025':
        // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;

      case 'P2014':
        // Required relation violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Required relation violation';
        break;

      default:
        this.logger.error(
          `Prisma error ${exception.code}: ${exception.message}`,
          exception.stack,
        );
    }

    const errorResponse: ApiResponseDto = {
      success: false,
      message,
      errors: [
        {
          code: exception.code,
          message: exception.message,
        },
      ],
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - Prisma Error ${exception.code}`,
    );

    response.status(status).json(errorResponse);
  }
}
