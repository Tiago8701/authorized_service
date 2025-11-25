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
import { Permission } from "../../database/models/permission";
import { System } from "../../database/models/system";
import { validateFromDTO } from "../../utils/validation";
import {
	CreateGroupDto,
	createGroupSchema,
	UpdateGroupDto,
	UpdateGroupPermissionsDto,
	updateGroupPermissionsSchema,
	updateGroupSchema,
} from "./group.dto";

const GroupService = EntityService(Group);
const PermissionService = EntityService(Permission);
const SystemService = EntityService(System);

@JsonController("/groups")
export class GroupsController {
	@Post()
	async create(@Body() payload: CreateGroupDto) {
		const data = await validateFromDTO(createGroupSchema, payload);
		if (!data.systemId) throw new Error("systemId is required");
		const exists = await GroupService.exists({
			where: { name: data.name },
		});
		if (exists) throw new Error("Group name must be unique");
		const system = await SystemService.findById(data.systemId);
		if (!system) throw new Error("System not found");
		let permissions: Permission[] = [];
		if (
			Array.isArray(data.permissionIds) &&
			data.permissionIds.length > 0
		) {
			permissions = await PermissionService.findAll({
				where: { id: In(data.permissionIds) },
			});
		}
		return await GroupService.create({
			name: data.name,
			system,
			permissions,
		});
	}

	@Get()
	async findAll() {
		return await GroupService.findAll({
			relations: ["permissions", "system"],
		});
	}

	@Get("/:id")
	async findById(@Param("id") id: number) {
		const group = await GroupService.findById(id);
		return group;
	}

	@Put("/:id")
	async update(@Param("id") id: number, @Body() payload: UpdateGroupDto) {
		const data = await validateFromDTO(updateGroupSchema, payload);
		const group = await GroupService.findById(id);
		if (!group) throw new Error("Group not found");
		if (data.name && data.name !== group.name) {
			const exists = await GroupService.exists({
				where: { name: data.name },
			});
			if (exists) throw new Error("Group name must be unique");
			group.name = data.name;
		}
		if (Array.isArray(data.permissionIds)) {
			group.permissions = await PermissionService.findAll({
				where: { id: In(data.permissionIds) },
			});
		}
		if (data.systemId) {
			const system = await SystemService.findById(data.systemId);
			if (!system) throw new Error("System not found");
			group.system = system;
		}
		return await GroupService.update(id, group);
	}

	@Delete("/:id")
	async delete(@Param("id") id: number) {
		await GroupService.delete(id);
	}

	@Put("/:id/permissions")
	async updatePermissions(
		@Param("id") id: number,
		@Body() body: UpdateGroupPermissionsDto,
	) {
		const data = await validateFromDTO(updateGroupPermissionsSchema, body);
		const group = await GroupService.findById(id);
		if (!group) throw new Error("Group not found");
		const permissionIds = Array.isArray(data.permissionIds)
			? data.permissionIds.filter(
					(id): id is number => typeof id === "number",
				)
			: [];
		group.permissions = await PermissionService.findAll({
			where: { id: In(permissionIds) },
		});
		return await GroupService.update(id, group);
	}
}
