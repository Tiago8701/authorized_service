import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class RegisteredError extends ApiError {
	constructor(
		message = DEFAULT_ERRORS.REGISTERED.message,
		type = DEFAULT_ERRORS.REGISTERED.code,
	) {
		super(message, 409, type);
	}
}
