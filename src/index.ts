import "reflect-metadata";

import dotenv from "dotenv";
import { terminal } from "terminal-kit";

import ExpressInfrastructure from "./infrastructures/express.infrastructure";
import MySqlInfrastructure from "./infrastructures/mysql.infrastructure";
import FeedbackService from "./services/feedback.service";
import { getLocalIP } from "./utils/network";

dotenv.config();

const infraestructures = [
    MySqlInfrastructure,
	 ExpressInfrastructure,
];

(async () => {
	try {
		terminal.clear();

		const now = new Date().toISOString();
		terminal.brightBlue.bold(`[${now}] Starting Infrastructures...\n\n`);

		for (const infraestructure of infraestructures) {
			await infraestructure.init();
		}

		terminal("\n".repeat(2));
		terminal.clear();

		const appName = `@api/${process.env.API_NAME}`;
		const port = process.env.SERVER_PORT;
		const env = process.env.NODE_ENV;

		terminal.bold.bgWhite.black(` ${appName} `.padEnd(60) + "\n\n");
		terminal.bgBlue.white(` 🚀 Server Started`.padEnd(60) + "\n\n");

		const labelWidth = 20;
		const lanIp = getLocalIP();
		const url = `http://localhost:${port}`;

		terminal.italic.cyan("NODE_ENV:".padEnd(labelWidth)).yellow(`${env}\n`);
		terminal.italic
			.cyan("SERVER_PORT:".padEnd(labelWidth))
			.white(`${port}\n`);
		terminal.italic.cyan("URL:".padEnd(labelWidth)).white(`${url}\n`);
		terminal.italic
			.cyan("LAN_IP:".padEnd(labelWidth))
			.white(`http://${lanIp}:${port}\n`);

		terminal("\n");
		terminal.cyan.bold(
			`[${new Date().toISOString()}] Server initialized successfully\n`,
		);
		terminal("\n");
		terminal.bold("#".repeat(60) + "\n\n");

		await FeedbackService.send();
	} catch (error) {
		terminal.red.bold(
			`[ERROR] ${error instanceof Error ? error.message : error}\n`,
		);
		process.exit(1);
	}
})();
