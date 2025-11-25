import { ApiError, DEFAULT_ERRORS } from "./api.error";

export class InternalServerError extends ApiError {
	constructor(error: any) {
		const message = error.message || DEFAULT_ERRORS.SERVER_ERROR.message;
		const type = error.type || DEFAULT_ERRORS.SERVER_ERROR.code;
		super(message, 500, type);
	}
}
