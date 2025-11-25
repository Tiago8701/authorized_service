import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { Group } from "./group";
import { Permission } from "./permission";

@Entity("systems")
export class System {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@Column({ nullable: true })
	description?: string;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updated_at: Date;

	@OneToMany(() => Group, (group) => group.system)
	groups: Group[];

	@OneToMany(() => Permission, (permission) => permission.system)
	permissions: Permission[];
}
