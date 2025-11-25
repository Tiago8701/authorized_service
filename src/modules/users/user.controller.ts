import {
	Body,
	Delete,
	Get,
	JsonController,
	Param,
	Post,
	Put,
} from "routing-controllers";
import { In } from "typeorm";

import { EntityService } from "../../_entity.service";
import { Group } from "../../database/models/group";
import { User } from "../../database/models/user";
import { validateFromDTO } from "../../utils/validation";
import {
	CreateUserDto,
	createUserSchema,
	UpdateUserDto,
	updateUserSchema,
} from "./user.dto";

const UserService = EntityService<User>(User);
const GroupService = EntityService<Group>(Group);

@JsonController("/users")
export class UsersController {
	@Post()
	async create(@Body() payload: CreateUserDto) {
		const data = await validateFromDTO(createUserSchema, payload);
		const exists = await UserService.exists({
			where: { email: data.email },
		});
		if (exists) throw new Error("Email must be unique");
		return await UserService.create(data);
	}

	@Get()
	async findAll() {
		return await UserService.findAll({ relations: ["groups"] });
	}

	@Get("/:id")
	async findById(@Param("id") id: number) {
		const userId = Number(id);

		const user = await UserService.findById(userId);
		if (!user) throw new Error("User not found");
		return user;
	}

	@Put("/:id")
	async update(@Param("id") id: number, @Body() payload: UpdateUserDto) {
		const data = await validateFromDTO(updateUserSchema, payload);
		const user = await UserService.findById(id);
		if (!user) throw new Error("User not found");
		if (data.email && data.email !== user.email) {
			const exists = await UserService.exists({
				where: { email: data.email },
			});
			if (exists) throw new Error("Email must be unique");
		}
		return await UserService.update(id, data);
	}

	@Delete("/:id")
	async delete(@Param("id") id: number) {
		const userId = Number(id);
		const user = await UserService.findById(userId);
		if (!user) throw new Error("User not found");
		await UserService.delete(userId);
	}

	@Put("/:id/groups")
	async updateGroups(
		@Param("id") id: number,
		@Body() body: { groupIds: number[] },
	) {
		const user = await UserService.findById(id);
		if (!user) throw new Error("User not found");
		const groups = await GroupService.findAll({
			where: { id: In(body.groupIds) },
		});
		if (groups.length !== body.groupIds.length)
			throw new Error("Some groups not found");
		user.groups = groups;
		return await UserService.update(id, user);
	}

	@Get("/:id/groups")
	async getUserGroups(@Param("id") id: number) {
		const user = await UserService.findOne({
			where: { id },
			relations: ["groups", "groups.system"],
		});
		if (!user) throw new Error("User not found");

		return {
			userId: user.id,
			name: user.name,
			email: user.email,
			groups:
				user.groups?.map((g) => ({
					id: g.id,
					name: g.name,
					system: g.system
						? { id: g.system.id, name: g.system.name }
						: null,
				})) || [],
		};
	}

	@Get("/:id/permissions")
	async getUserPermissions(@Param("id") id: number) {
		const user = await UserService.findOne({
			where: { id },
			relations: [
				"groups",
				"groups.system",
				"groups.permissions",
				"groups.permissions.system",
			],
		});
		if (!user) throw new Error("User not found");

		const systemsMap: Record<
			number,
			{ systemId: number; systemName: string; permissions: string[] }
		> = {};

		for (const group of user.groups || []) {
			const system = group.system;
			if (!system) continue;
			if (!systemsMap[system.id]) {
				systemsMap[system.id] = {
					systemId: system.id,
					systemName: system.name,
					permissions: [],
				};
			}
			for (const permission of group.permissions || []) {
				if (
					permission?.name &&
					!systemsMap[system.id].permissions.includes(permission.name)
				) {
					systemsMap[system.id].permissions.push(permission.name);
				}
			}
		}

		return {
			userId: user.id,
			name: user.name,
			email: user.email,
			systems: Object.values(systemsMap),
		};
	}
}
