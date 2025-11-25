import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class ForbiddenError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.FORBIDDEN.message,
		type = DEFAULT_ERRORS.FORBIDDEN.code,
	) {
		super(message, 403, type);
	}
}
