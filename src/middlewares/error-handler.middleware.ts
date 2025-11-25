import { NextFunction, Request, Response } from "express";
import {
	ExpressErrorMiddlewareInterface,
	HttpError,
	Middleware,
} from "routing-controllers";

import { IsApiError } from "@/errors/api.error";

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
	error(err: any, req: Request, res: Response, next: NextFunction) {
		if (res.headersSent) {
			return next(err);
		}

		if (IsApiError(err)) {
			return res.status(err.statusCode).json({
				success: false,
				error: {
					code: err.type || "error",
					message: err.message,
				},
			});
		}

		if (err instanceof HttpError) {
			return res.status(err.httpCode).json({
				success: false,
				error: {
					code: err.name,
					message: err.message,
				},
			});
		}

		const isDev = process.env.NODE_ENV === "development";
		return res.status(500).json({
			success: false,
			error: {
				message: isDev
					? err.message || "Internal server error"
					: "Something went wrong",
				stack: isDev ? err.stack : undefined,
			},
		});
	}
}
