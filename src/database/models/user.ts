import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable
} from "typeorm";
import { Group } from "./group";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar", length: 100 })
	name: string;

	@Column({ type: "varchar", length: 100, unique: true })
	email: string;

	@Column({ type: "varchar", length: 255 })
	password: string;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updated_at: Date;
	@ManyToMany(() => Group, group => group.users)
	@JoinTable({
		name: "user_groups",
		joinColumn: { name: "user_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "group_id", referencedColumnName: "id" }
	})
	groups: Group[];
}
