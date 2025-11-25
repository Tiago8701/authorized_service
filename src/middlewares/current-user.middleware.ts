import { Action } from "routing-controllers";

import { InternalServerError } from "../errors/internal-server.error";
import JwtInfrastructure from "../infrastructures/jwt.infrastructure";

export const CurrentUserMiddleware = async (action: Action) => {
	try {
		const token = JwtInfrastructure.getFromRequest(action.request) || false;
		const user: any = !token ? false : JwtInfrastructure.verify(token);
		return user;
	} catch (error) {
		throw new InternalServerError(error);
	}
};
