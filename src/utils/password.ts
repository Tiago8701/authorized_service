import bcrypt from "bcryptjs";

export const generatePassword = (
	length = 12,
	options = {
		digits: true,
		lowercase: true,
		uppercase: true,
		symbols: true,
	},
) => {
	const optionsChars = {
		digits: "1234567890",
		lowercase: "abcdefghijklmnopqrstuvwxyz",
		uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		symbols: "^$%&*()?@!%=+_",
	};

	const chars: {
		digits: string;
		lowercase: string;
		uppercase: string;
		symbols: string;
	}[] = [];

	for (const key in options) {
		if (
			Object.prototype.hasOwnProperty.call(options, key) &&
			options[key] &&
			Object.prototype.hasOwnProperty.call(optionsChars, key)
		) {
			chars.push(optionsChars[key]);
		}
	}

	if (!chars.length) return "";

	let password = "";

	for (let j = 0; j < chars.length; j++) {
		const str = String(chars[j]);
		password += str.charAt(Math.floor(Math.random() * str.length));
	}

	if (length > chars.length) {
		length = length - chars.length;
		for (let i = 0; i < length; i++) {
			const index = Math.floor(Math.random() * chars.length);
			const pass = String(chars[index]);
			password += pass.charAt(Math.floor(Math.random() * pass.length));
		}
	}
	return password;
};

export const checkPasswords = async (password1: string, password2: string) => {
	if (!password1 || !password2 || password1 == "" || password2 == "")
		throw new Error("Passwords cannot be empty");

	return await bcrypt.compare(password1, password2);
};

export const hashPassword = (password: string) => {
	return bcrypt.hash(password, bcrypt.genSaltSync(8));
};
