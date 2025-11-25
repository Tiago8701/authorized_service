import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class NotFoundError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.NOT_FOUND.message,
		type = DEFAULT_ERRORS.NOT_FOUND.code,
	) {
		super(message, 404, type);
	}
}
