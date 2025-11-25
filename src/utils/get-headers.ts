import { ApolloServerContext } from "../configs/apollo-server";

export const getHeaders = (context: ApolloServerContext) => {
	const userAgent = context.req?.headers["user-agent"] || "";
	const platform = getPlatform(userAgent);
	const browser = getBrowser(userAgent);

	return {
		platform: context.req?.headers["x-user-agent-platform"] || platform,
		browser: context.req?.headers["x-user-agent-browser"] || browser,
		region: context.req?.headers["x-user-agent-region"] || "Unknown Region",
		city: context.req?.headers["x-user-agent-city"] || "Unknown City",
		ip: context.ipAddress || "Unknown IP",
	};
};

const getPlatform = (userAgent: string) => {
	if (userAgent.indexOf("Win") !== -1) return "Windows";
	if (userAgent.indexOf("Mac") !== -1) return "MacOS";
	if (userAgent.indexOf("X11") !== -1) return "UNIX";
	if (userAgent.indexOf("Linux") !== -1) return "Linux";
	return "Unknown OS";
};

const getBrowser = (userAgent: string) => {
	if (userAgent.indexOf("Firefox") !== -1) return "Firefox";
	if (userAgent.indexOf("Chrome") !== -1) return "Chrome";
	if (
		userAgent.indexOf("Safari") !== -1 &&
		userAgent.indexOf("Chrome") === -1
	)
		return "Safari";
	if (userAgent.indexOf("Edge") !== -1) return "Edge";
	if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1)
		return "Opera";
	return "Unknown Browser";
};
