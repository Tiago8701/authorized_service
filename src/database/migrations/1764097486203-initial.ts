import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1764097486203 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE systems (
				id INT AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(255) UNIQUE NOT NULL,
				description VARCHAR(255),
				created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
			);
		`);
		await queryRunner.query(`
			CREATE TABLE users (
				id INT AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(100) NOT NULL,
				email VARCHAR(100) UNIQUE NOT NULL,
				password VARCHAR(255) NOT NULL,
				created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
			);
		`);
		await queryRunner.query(`
			CREATE TABLE groups (
				id INT AUTO_INCREMENT PRIMARY KEY,
				system_id INT NOT NULL,
				name VARCHAR(255) NOT NULL,
				description VARCHAR(255),
				created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
				UNIQUE KEY unique_system_name (system_id, name),
				FOREIGN KEY (system_id) REFERENCES systems(id)
			);
		`);
		await queryRunner.query(`
			CREATE TABLE permissions (
				id INT AUTO_INCREMENT PRIMARY KEY,
				system_id INT NOT NULL,
				name VARCHAR(255) NOT NULL,
				description VARCHAR(255),
				created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
				UNIQUE KEY unique_system_name (system_id, name),
				FOREIGN KEY (system_id) REFERENCES systems(id)
			);
		`);
		await queryRunner.query(`
			CREATE TABLE group_permissions (
				id INT AUTO_INCREMENT PRIMARY KEY,
				group_id INT NOT NULL,
				permission_id INT NOT NULL,
				created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
				FOREIGN KEY (group_id) REFERENCES groups(id),
				FOREIGN KEY (permission_id) REFERENCES permissions(id)
			);
		`);
		await queryRunner.query(`
			CREATE TABLE user_groups (
				id INT AUTO_INCREMENT PRIMARY KEY,
				user_id INT NOT NULL,
				group_id INT NOT NULL,
				created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
				updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
				FOREIGN KEY (user_id) REFERENCES users(id),
				FOREIGN KEY (group_id) REFERENCES groups(id)
			);
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS user_groups;`);
		await queryRunner.query(`DROP TABLE IF EXISTS group_permissions;`);
		await queryRunner.query(`DROP TABLE IF EXISTS permissions;`);
		await queryRunner.query(`DROP TABLE IF EXISTS groups;`);
		await queryRunner.query(`DROP TABLE IF EXISTS users;`);
		await queryRunner.query(`DROP TABLE IF EXISTS systems;`);
	}
}
