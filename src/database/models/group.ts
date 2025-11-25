import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from "typeorm";

import { Permission } from "./permission";
import { System } from "./system";
import { User } from "./user";

@Entity("groups")
@Unique(["system", "name"])
export class Group {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => System, (system) => system.groups)
	@JoinColumn({ name: "system_id" })
	system: System;

	@Column()
	name: string;

	@Column({ nullable: true })
	description?: string;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updated_at: Date;

	@ManyToMany(() => Permission, (permission) => permission.groups)
	@JoinTable({
		name: "group_permissions",
		joinColumn: { name: "group_id", referencedColumnName: "id" },
		inverseJoinColumn: {
			name: "permission_id",
			referencedColumnName: "id",
		},
	})
	permissions: Permission[];

	@ManyToMany(() => User, (user) => user.groups)
	users: User[];
}
