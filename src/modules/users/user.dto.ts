import * as Yup from "yup";

export type CreateUserDto = {
	name: string;
	email: string;
	password: string;
};

export type UpdateUserDto = {
	name?: string;
	email?: string;
	password?: string;
};

export const createUserSchema = Yup.object({
	name: Yup.string().required().max(100),
	email: Yup.string().required().email().max(100),
	password: Yup.string().required().min(6).max(100),
});

export const updateUserSchema = Yup.object({
	name: Yup.string().optional().max(100),
	email: Yup.string().optional().email().max(100),
	password: Yup.string().optional().min(6).max(100),
});
