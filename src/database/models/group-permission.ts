import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from "typeorm";

import { Group } from "./group";
import { Permission } from "./permission";

@Entity("group_permissions")
@Unique(["group", "permission"])
export class GroupPermission {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Group)
	@JoinColumn({ name: "group_id" })
	group: Group;

	@ManyToOne(() => Permission)
	@JoinColumn({ name: "permission_id" })
	permission: Permission;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updated_at: Date;
}
