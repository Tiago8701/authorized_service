import * as Yup from "yup";

export type CreateSystemDto = {
	name: string;
	description?: string;
};

export type UpdateSystemDto = {
	name?: string;
	description?: string;
};

export const createSystemSchema = Yup.object({
	name: Yup.string().required().max(100),
	description: Yup.string().optional().max(255),
});

export const updateSystemSchema = Yup.object({
	name: Yup.string().optional().max(100),
	description: Yup.string().optional().max(255),
});
