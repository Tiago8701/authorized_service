import { rateLimit } from "express-rate-limit";

const rateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: process.env.NODE_ENV === "production" ? 15 : 100,
	standardHeaders: true,
	legacyHeaders: false,
});

export default rateLimiter;
