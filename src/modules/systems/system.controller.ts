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
import { System } from "../../database/models/system";
import { validateFromDTO } from "../../utils/validation";
import {
	CreateSystemDto,
	createSystemSchema,
	UpdateSystemDto,
	updateSystemSchema,
} from "./system.dto";

const SystemService = EntityService(System);

@JsonController("/systems")
export class SystemsController {
	@Post()
	async create(@Body() payload: CreateSystemDto) {
		const data = await validateFromDTO(createSystemSchema, payload);
		const exists = await SystemService.exists({
			where: { name: data.name },
		});
		if (exists) throw new Error("System name must be unique");
		return await SystemService.create(data);
	}

	@Get()
	async findAll() {
		return await SystemService.findAll({});
	}

	@Get("/:id")
	async findById(@Param("id") id: number) {
		return await SystemService.findById(id);
	}

	@Put("/:id")
	async update(@Param("id") id: number, @Body() payload: UpdateSystemDto) {
		const data = await validateFromDTO(updateSystemSchema, payload);
		const system = await SystemService.findById(id);
		if (data.name && data.name !== system.name) {
			const exists = await SystemService.exists({
				where: { name: data.name },
			});
			if (exists) throw new Error("System name must be unique");
		}
		return await SystemService.update(id, data);
	}

	@Delete("/:id")
	async delete(@Param("id") id: number) {
		await SystemService.delete(id);
	}
}
