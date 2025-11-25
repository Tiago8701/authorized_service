import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class BadRequestError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.BAD_REQUEST.message,
		type = DEFAULT_ERRORS.BAD_REQUEST.code,
	) {
		super(message, 400, type);
	}
}
