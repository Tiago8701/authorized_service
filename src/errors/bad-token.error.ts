import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class BadTokenError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.BAD_TOKEN.message,
		type = DEFAULT_ERRORS.BAD_TOKEN.code,
	) {
		super(message, 401, type);
	}
}
