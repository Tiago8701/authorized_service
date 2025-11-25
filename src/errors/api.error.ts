import { HttpError } from "./http.error";

export const DEFAULT_ERRORS = {
	BAD_TOKEN: {
		code: "BAD_TOKEN",
		message: "Token is not valid",
	},
	TOKEN_EXPIRED: {
		code: "TOKEN_EXPIRED",
		message: "Token expired",
	},
	UNAUTHORIZED: {
		code: "UNAUTHORIZED",
		message: "Invalid credentials",
	},
	SERVER_ERROR: {
		code: "SERVER_ERROR",
		message: "Internal server error",
	},
	NOT_FOUND: {
		code: "NOT_FOUND",
		message: "Not found",
	},
	BAD_REQUEST: {
		code: "BAD_REQUEST",
		message: "Bad request",
	},
	FORBIDDEN: {
		code: "FORBIDDEN",
		message: "Permission denied",
	},
	VALIDATION: {
		code: "VALIDATION",
		message: "Validation error",
	},
	REGISTERED: {
		code: "REGISTERED",
		message: "Already registered",
	},
};

export class ApiError extends HttpError {
	constructor(message: string, statusCode: number, type: string) {
		super(message, statusCode, type, true);
	}
}

export const IsApiError = (err: { isOperational: boolean }) =>
	err instanceof ApiError ? err.isOperational : false;
