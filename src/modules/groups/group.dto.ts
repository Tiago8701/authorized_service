import * as Yup from "yup";

export type CreateGroupDto = {
	name: string;
	description?: string;
	systemId: number;
	permissionIds?: number[];
};

export type UpdateGroupDto = {
	name?: string;
	description?: string;
	systemId?: number;
	permissionIds?: number[];
};

export type UpdateGroupPermissionsDto = {
	permissionIds: number[];
};

const permissionIdsSchema = Yup.array()
	.of(Yup.number().integer().positive())
	.optional();

export const createGroupSchema = Yup.object({
	name: Yup.string().required().max(100),
	description: Yup.string().optional().max(255),
	systemId: Yup.number().required().integer().positive(),
	permissionIds: permissionIdsSchema,
});

export const updateGroupSchema = Yup.object({
	name: Yup.string().optional().max(100),
	description: Yup.string().optional().max(255),
	systemId: Yup.number().optional().integer().positive(),
	permissionIds: permissionIdsSchema,
});

export const updateGroupPermissionsSchema = Yup.object({
	permissionIds: Yup.array()
		.of(Yup.number().integer().positive())
		.required()
		.min(1, "Must have at least one permission"),
});
