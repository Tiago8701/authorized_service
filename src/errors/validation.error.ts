import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class ValidationError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.VALIDATION.message,
		type = DEFAULT_ERRORS.VALIDATION.code,
	) {
		super(message, 400, type);
	}
}
