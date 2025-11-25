import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();
export const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: process.env.DATABASE_NAME,
	synchronize: false,
	logging: true,
	entities: ["src/database/models/**/*.ts"],
	migrations: ["src/database/migrations/**/*.ts"],

	namingStrategy: new SnakeNamingStrategy(),
	subscribers: [],
});
