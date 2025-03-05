import { Response, Request } from "express";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";

export type RequestBody<T> = Request<{}, {}, T>;
export type RequestParams<T> = Request<T, {}, {}>;
export type RequestQuery<T> = Request<{}, T, {}>;

export type PageLimit = {
  page: number;
  limit: number;
};

export interface ApiSuccessResponse<T> {
  message: string;
  data: T;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  affectedColumns?: string[];
  target?: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
}

export interface Pagination {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface APIPaginatedResponse<T> extends ApiSuccessResponse<T> {
  pagination: Pagination;
}

const formatZodError = (error: ZodError): ValidationError[] => {
  return error.errors.map((err) => ({
    field: err.path.slice(1).map(String).join(".") || String(err.path[0]),
    message: err.message,
    code: err.code,
  }));
};

const formatValidationErrors = (
  errors: any[] | { message: string; type?: string }[]
): ValidationError[] => {
  return errors.map((err) => {
    if ("field" in err) return err as ValidationError;
    return {
      field: String(err.type || "unknown"),
      message: err.message,
    };
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
};

export const createSuccessResponse = <T extends object>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) => {
  const apiSuccessResponse: ApiSuccessResponse<T> = {
    message,
    data,
  };
  res.status(statusCode).json(apiSuccessResponse);
};

export const createPaginatedResponse = <T extends object>(
  res: Response,
  data: T,
  currentPage: number,
  itemsPerPage: number,
  totalItems: number,
  message: string = "Success",
  statusCode = 200
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedResponse: APIPaginatedResponse<T> = {
    message,
    data,
    pagination: {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    },
  };
  res.status(statusCode).json(paginatedResponse);
};

export const createErrorResponse = (
  res: Response,
  error: unknown,
  statusCode = 500
) => {
  let message = "An error occurred";
  let validationErrors: ValidationError[] | undefined;

  if (
    error instanceof Error &&
    "errorCode" in error &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null
  ) {
  } else if (error instanceof MongooseError) {
    message = `Database error ${error.message}`;
  } else if (error instanceof ZodError) {
    message = "Validation failed";
    statusCode = 400;
    validationErrors = formatZodError(error);
  } else if (Array.isArray(error)) {
    message = "Validation failed";
    statusCode = 400;
    validationErrors = formatValidationErrors(error);
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  const errorResponse: ApiErrorResponse = {
    message,
    ...(validationErrors && { errors: validationErrors }),
  };

  res.status(statusCode).json(errorResponse);
};
