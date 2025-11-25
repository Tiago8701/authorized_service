import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from "typeorm";

import { Group } from "./group";
import { System } from "./system";

@Entity("permissions")
@Unique(["system", "name"])
export class Permission {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => System, (system) => system.permissions)
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

	@ManyToMany(() => Group, (group) => group.permissions)
	groups: Group[];
}
