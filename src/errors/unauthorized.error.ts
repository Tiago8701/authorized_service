import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class UnauthorizedError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.UNAUTHORIZED.message,
		type = DEFAULT_ERRORS.UNAUTHORIZED.code,
	) {
		super(message, 401, type);
	}
}
