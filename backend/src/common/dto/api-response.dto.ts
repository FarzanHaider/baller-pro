import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ required: false })
  field?: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  code?: string;
}

export class ApiResponseDto<T = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ type: [ApiErrorDto], required: false })
  errors?: ApiErrorDto[];
}

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export class PaginatedResponseDto<T = any> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: {
    items: T[];
    pagination: PaginationDto;
  };
}

// Helper function to create success response
export function createSuccessResponse<T>(data: T, message = 'Success'): ApiResponseDto<T> {
  return {
    success: true,
    message,
    data,
  };
}

// Helper function to create error response
export function createErrorResponse(message: string, errors?: ApiErrorDto[]): ApiResponseDto {
  return {
    success: false,
    message,
    errors,
  };
}

// Helper function to create paginated response
export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Items retrieved',
): PaginatedResponseDto<T> {
  return {
    success: true,
    message,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
}
