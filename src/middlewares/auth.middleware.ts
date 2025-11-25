import { Action } from "routing-controllers";

import { ForbiddenError } from "../errors/forbidden.error";
import JwtInfrastructure from "../infrastructures/jwt.infrastructure";

export const AuthorizationMiddleware = async (
	action: Action,
	profiles: string[],
) => {
	try {
		const token = JwtInfrastructure.getFromRequest(action.request) || false;
		const user: any = !token ? false : JwtInfrastructure.verify(token);

		if (user && !profiles.length) return true;
		if (
			user &&
			profiles.find((profile) => user.profile.indexOf(profile) !== -1)
		)
			return true;

		throw new ForbiddenError();
	} catch {
		throw new ForbiddenError();
	}
};
