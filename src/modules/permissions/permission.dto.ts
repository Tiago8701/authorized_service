import * as Yup from "yup";

export type CreatePermissionDto = {
	name: string;
	description?: string;
	systemId: number;
};

export type UpdatePermissionDto = {
	name?: string;
	description?: string;
	systemId?: number;
};

export const createPermissionSchema = Yup.object({
	name: Yup.string().required().max(100),
	description: Yup.string().optional().max(255),
	systemId: Yup.number().required().integer().positive(),
});

export const updatePermissionSchema = Yup.object({
	name: Yup.string().optional().max(100),
	description: Yup.string().optional().max(255),
	systemId: Yup.number().optional().integer().positive(),
});
