import path from "path";
import compression from "compression";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import { useExpressServer } from "routing-controllers";

import { AuthorizationMiddleware } from "../middlewares/auth.middleware";
import { CurrentUserMiddleware } from "../middlewares/current-user.middleware";
import rateLimiter from "../middlewares/rate-limiter.middleware";
import requestLogger from "../middlewares/request-logger.middleware";

let app: Express;

const ExpressInfrastructure = {
	init: async () => {
		try {
			app = express();

			app.set("trust proxy", 1);

			app.use(
				compression() as unknown as express.RequestHandler,
				helmet(),
				cors(),
				requestLogger(),
				rateLimiter,
				express.json({ limit: "50mb" }),
				express.urlencoded({
					limit: "50mb",
					extended: true,
					parameterLimit: 1000,
				}),
			);

			useExpressServer(app, {
				controllers: [
					path.dirname(require.main?.filename || "") +
						"/modules/**/*.controller.ts",
				],
				middlewares: [path.join(__dirname, "/../middlewares/**/*.ts")],
				authorizationChecker: AuthorizationMiddleware,
				currentUserChecker: CurrentUserMiddleware,
				defaultErrorHandler: false,
			});

			app.listen(process.env.SERVER_PORT);

			console.info("[EXPRESS] Express infrastructure initialized");
		} catch (error) {
			console.error(
				"[EXPRESS] Error during express infrastructure initialization",
			);

			throw error;
		}
	},
};

export default ExpressInfrastructure;
