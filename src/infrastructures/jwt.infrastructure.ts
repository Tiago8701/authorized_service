import { differenceInMilliseconds } from "date-fns";
import dotenv from "dotenv";
import { Request } from "express";
import { decode, JwtPayload, sign, verify } from "jsonwebtoken";

let jwtidCounter = 0;
const blacklist = [] as any[];
dotenv.config();

const JwtInfrastructure = {
	sign: (payload: object) => {
		try {
			console.info("[JWT] Generating fastify JWT sign");

			const token = JSON.parse(JSON.stringify(payload));

			jwtidCounter = jwtidCounter + 1;

			return sign({ token }, process.env.SERVER_JWT_SECRET as string, {
				expiresIn: "3 days",
				jwtid: jwtidCounter.toString(),
			});
		} catch (error) {
			console.error("[JWT] Error during fastify JWT sign");
			throw error;
		}
	},

	getFromRequest: (request: Request) => {
		try {
			if (
				!request.headers.authorization ||
				request.headers.authorization.split(" ")[0] !== "Bearer"
			)
				throw new Error("[JWT] JWT token not provided");

			return request.headers.authorization.split(" ")[1];
		} catch (error) {
			console.error("[JWT] Error getting JWT token");
			throw error;
		}
	},

	verify: (token: string) => {
		try {
			const decoded = verify(
				token,
				process.env.SERVER_JWT_SECRET as string,
			) as any;

			blacklist.forEach((element: any) => {
				if (
					element.jti === decoded.jti &&
					element.iat === decoded.iat &&
					element.exp === decoded.exp
				)
					throw new Error("[JWT] Token blacklisted");
			});

			return decoded.token.user;
		} catch (error) {
			console.error("[JWT] Error verifying JWT token");
			throw error;
		}
	},

	blacklist: (token: string) => {
		try {
			while (
				blacklist.length &&
				differenceInMilliseconds(new Date(), new Date(+0)) / 1000 >
					blacklist[0].exp
			) {
				console.info(
					`[JWT] Removing from blacklist timed out JWT with id ${blacklist[0].jti}`,
				);
				blacklist.shift();
			}
			const { jti, exp, iat } = decode(token) as JwtPayload;
			console.info(
				`[JWT] Adding JWT ${token} with id ${jti} to blacklist`,
			);
			blacklist.push({ jti, exp, iat });
		} catch (error) {
			console.error("[JWT] Error blacklisting fastify JWT token");
			throw error;
		}
	},
};

export default JwtInfrastructure;
