import {
	Body,
	Delete,
	Get,
	JsonController,
	Param,
	Post,
	Put,
} from "routing-controllers";

import { EntityService } from "../../_entity.service";
import { Permission } from "../../database/models/permission";
import { System } from "../../database/models/system";
import { validateFromDTO } from "../../utils/validation";
import {
	CreatePermissionDto,
	createPermissionSchema,
	UpdatePermissionDto,
	updatePermissionSchema,
} from "./permission.dto";

const PermissionService = EntityService(Permission);
const SystemService = EntityService(System);

@JsonController("/permissions")
export class PermissionsController {
	@Post()
	async create(@Body() payload: CreatePermissionDto) {
		const data = await validateFromDTO(createPermissionSchema, payload);
		if (!data.systemId) throw new Error("systemId is required");
		const exists = await PermissionService.exists({
			where: { name: data.name },
		});
		if (exists) throw new Error("Permission name must be unique");
		const system = await SystemService.findById(data.systemId);
		if (!system) throw new Error("System not found");
		return await PermissionService.create({
			name: data.name,
			system,
		});
	}

	@Get()
	async findAll() {
		return await PermissionService.findAll({ relations: ["system"] });
	}

	@Get("/:id")
	async findById(@Param("id") id: number) {
		const permission = await PermissionService.findById(id);
		return permission;
	}

	@Put("/:id")
	async update(
		@Param("id") id: number,
		@Body() payload: UpdatePermissionDto,
	) {
		const data = await validateFromDTO(updatePermissionSchema, payload);
		const permission = await PermissionService.findById(id);
		if (!permission) throw new Error("Permission not found");
		if (data.name && data.name !== permission.name) {
			const exists = await PermissionService.exists({
				where: { name: data.name },
			});
			if (exists) throw new Error("Permission name must be unique");
		}
		if (data.systemId) {
			const system = await SystemService.findById(data.systemId);
			if (!system) throw new Error("System not found");
			permission.system = system;
		}
		if (data.name) permission.name = data.name;
		return await PermissionService.update(id, permission);
	}

	@Delete("/:id")
	async delete(@Param("id") id: number) {
		await PermissionService.delete(id);
	}
}
