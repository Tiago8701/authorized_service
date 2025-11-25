import { Request } from "express";

export const getIpAddress = (req: Request): string => {
	const ip =
		req.headers["x-user-agent-ip"] ||
		req.headers["x-forwarded-for-ip"] ||
		req.headers["x-forwarded-for"] ||
		req.connection.remoteAddress;

	return ip ? String(ip).split(",")[0].trim() : "";
};
