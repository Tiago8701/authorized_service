import { randomUUID } from "crypto";
import { createWriteStream } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { Request, RequestHandler, Response } from "express";
import pino, { LevelWithSilent } from "pino";
import { CustomAttributeKeys, Options, pinoHttp } from "pino-http";
import pretty from "pino-pretty";

const logStream = createWriteStream("logs.log", { flags: "a" });
const prettyStream = pretty({
	colorize: true,
	translateTime: true,
	messageFormat:
		"{req.method} {req.url} {res.statusCode} {res.responseTime}ms",
});

prettyStream.pipe(logStream);

type PinoCustomProps = {
	request: {
		id: string;
		method: string;
		url: string;
		query: Record<string, any>;
		params: Record<string, any>;
		headers: Record<string, any>;
		remoteAddress: string;
		remotePort: number;
	};
	response: {
		statusCode: number | null;
		headers: Record<string, any>;
	};
	err: Error | null;
	responseBody: unknown;
};

const customAttributeKeys: CustomAttributeKeys = {
	req: "request",
	res: "response",
	err: "error",
	responseTime: "timeTaken",
};

const customProps = (req: Request, res: Response): PinoCustomProps => ({
	request: {
		id: (req.headers["x-request-id"] as string) || randomUUID(),
		method: req.method,
		url: req.originalUrl,
		query: req.query,
		params: req.params,
		headers: req.headers,
		remoteAddress: req.ip || "x.x.x.x",
		remotePort: req.connection.remotePort || 0,
	},
	response: {
		statusCode: res.statusCode || null,
		headers: res.getHeaders(),
	},
	err: res.locals.err || null,
	responseBody: res.locals.responseBody,
});

const responseBodyMiddleware: RequestHandler = (_req, res, next) => {
	const originalSend = res.send;
	res.send = function (content) {
		res.locals.responseBody = content;
		res.send = originalSend;
		return originalSend.call(res, content);
	};
	next();
};

const customLogLevel = (
	_req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	err?: Error,
): LevelWithSilent => {
	if (err) return "error";
	if (res.statusCode >= 500) return "error";
	if (res.statusCode >= 400) return "warn";
	if (res.statusCode >= 300) return "info";
	return "info";
};

const genReqId = (
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
) => {
	const existingID = req.headers["x-request-id"];
	if (existingID) return existingID as string;
	const id = randomUUID();
	res.setHeader("X-Request-Id", id);
	return id;
};
const customSuccessMessage = (
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	responseTime: number,
): string => {
	const message =
		res.statusCode === 404
			? "Resource not found"
			: `${req.method} request completed`;
	return `${message} (URL: ${req.url}, Status Code: ${res.statusCode}, Response Time: ${responseTime}ms)`;
};

const customErrorMessage = (
	req: IncomingMessage,
	res: ServerResponse<IncomingMessage>,
	error: Error,
): string => {
	const message = error.message || "Unknown error";
	return `Request failed: ${message} (URL: ${req.url}, Status Code: ${res.statusCode})`;
};

const pinoLogger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			levelFirst: true,
			translateTime: "SYS:standard",
			ignore: "pid,hostname",
		},
	},
});

const requestLogger = (options?: Options): RequestHandler[] => {
	const pinoOptions: Options = {
		logger: pinoLogger,
		customProps: customProps as unknown as Options["customProps"],
		redact: ["request.headers.authorization", "response.headers"],
		genReqId,
		customLogLevel,
		customSuccessMessage,
		customErrorMessage,
		customAttributeKeys,
		...options,
	};
	return [responseBodyMiddleware, pinoHttp(pinoOptions)];
};

export default requestLogger;
