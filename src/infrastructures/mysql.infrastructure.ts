import { AppDataSource } from "@/configs/orm-config";

const MySqlInfrastructure = {
	init: async () => {
		try {
			await AppDataSource.initialize();

			console.info("[MYSQL] MySQL Database infrastructure initialized");
		} catch (error) {
			console.error(
				"[MYSQL] Error during MySQL Database infrastructure initialization",
				error,
			);
			throw error;
		}
	},
};

export default MySqlInfrastructure;
