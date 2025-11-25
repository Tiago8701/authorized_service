import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class TokenExpiredError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.TOKEN_EXPIRED.message,
		type = DEFAULT_ERRORS.TOKEN_EXPIRED.code,
	) {
		super(message, 401, type);
	}
}
