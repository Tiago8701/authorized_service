export class HttpError extends Error {
	public type: string;
	public statusCode: number;
	public isOperational: boolean;
	constructor(
		message: string,
		statusCode: number,
		type: string,
		isOperational: boolean,
	) {
		super(message);
		this.type = type;
		this.statusCode = statusCode;
		this.isOperational = isOperational;
	}
}
