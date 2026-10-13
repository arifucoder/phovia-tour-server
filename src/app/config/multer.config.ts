// src/app/config/multer.config.ts
import type { UploadApiResponse } from "cloudinary";
import multer, { type StorageEngine } from "multer";
import path from "path";
import { cloudinaryUpload } from "./cloudinary.config";

// "My Special.Image#!@.png" -> "k3j9x2abc-1760000000000-my-special-image"
const makeUniqueFileName = (originalName: string) => {
	const fileName = path
		.parse(originalName)
		.name.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/\./g, "-")
		.replace(/[^a-z0-9-]/g, "");

	return Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;
};

const cloudinaryStorage: StorageEngine = {
	// প্রতিটা file আসলে multer এটা call করে
	_handleFile(req, file, cb) {
		const uploadStream = cloudinaryUpload.uploader.upload_stream(
			{
				resource_type: "auto",
				public_id: makeUniqueFileName(file.originalname),
			},
			(error, result?: UploadApiResponse) => {
				if (error || !result) return cb(error ?? new Error("Cloudinary upload failed"));

				// আগের package যা দিত, ঠিক তাই — তাই controller বদলাতে হবে না
				cb(null, {
					path: result.secure_url, // req.file.path = Cloudinary URL
					filename: result.public_id,
					size: result.bytes,
				});
			},
		);

		file.stream.on("error", cb);
		file.stream.pipe(uploadStream);
	},

	// কোনো কারণে request fail করলে multer এটা দিয়ে upload করা file মুছে দেয়
	_removeFile(req, file, cb) {
		cloudinaryUpload.uploader.destroy(file.filename).then(
			() => cb(null),
			(error) => cb(error),
		);
	},
};

export const multerUpload = multer({ storage: cloudinaryStorage });
