import multer from "multer";

const CSV_MIME_TYPES = new Set([
	"text/csv",
	"application/csv",
	"text/plain",
	"application/vnd.ms-excel",
]);

export const uploadCsv = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024,
		files: 1,
		fieldSize: 512 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (CSV_MIME_TYPES.has(file.mimetype)) return cb(null, true);
		cb(new Error("Arquivo deve ser um CSV válido."));
	},
});
