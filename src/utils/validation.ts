import { Schema } from "yup";

import { ValidationError } from "@/errors/validation.error";

export const validateFromDTO = async <T>(
	dto: Schema<T>,
	value: any,
): Promise<T> => {
	return (await dto
		.validate(value, { abortEarly: false })
		.catch((validationError) => {
			throw new ValidationError(validationError.errors.toString());
		})) as T;
};
