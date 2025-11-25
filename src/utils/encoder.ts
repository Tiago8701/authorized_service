import crypto from "crypto";

const key = Buffer.from("a0ad538deb00e3dd0b1f40b2a8d7b424", "utf-8");

const iv = Buffer.from("cb47fe44dc08af16", "utf-8");

export const encrypt = (text: string) => {
	const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return encrypted.toString("hex");
};

export const decrypt = (text: string) => {
	const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
	const encryptedText = Buffer.from(text, "hex");
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};
