/* eslint-disable @typescript-eslint/no-explicit-any */

// Frontedn -> Form Data with Image File -> Multer -> Form data -> Req (Body + File)

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import Stream from "stream";
import AppError from "../errorHelpers/AppError";
import { envVars } from "./env";

// Amader folder -> image -> form data -> File -> Multer -> Amader project / pc te Nijer ekta folder(temporary) -> Req.file

//req.file -> cloudinary(req.file) -> url -> mongoose -> mongodb

cloudinary.config({
	cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
	api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
	api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (
	buffer: Buffer,
	fileName: string,
): Promise<UploadApiResponse | undefined> => {
	try {
		return new Promise((resolve, reject) => {
			const public_id = `pdf/${fileName}-${Date.now()}`;

			const bufferStream = new Stream.PassThrough();
			bufferStream.end(buffer);

			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "auto",
						public_id: public_id,
						folder: "pdf",
					},
					(error, result) => {
						if (error) {
							return reject(error);
						}
						resolve(result);
					},
				)
				.end(buffer);
		});
	} catch (error: any) {
		console.log(error);
		throw new AppError(401, `Error uploading file ${error.message}`);
	}
};

export const deleteImageFromCLoudinary = async (url: string) => {
	try {
		// https://res.cloudinary.com/<cloud>/image/upload/v1753126572/<public_id>.jpg
		const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+$/i;
		const match = url.match(regex);

		if (!match?.[1]) {
			console.warn("Could not extract public_id from:", url);
			return;
		}

		const public_id = match[1];
		const result = await cloudinary.uploader.destroy(public_id);
		console.log(`Cloudinary destroy ${public_id}:`, result); // { result: "ok" } or { result: "not found" }
	} catch (error: any) {
		throw new AppError(401, "Cloudinary image deletion failed", error.message);
	}
};

export const cloudinaryUpload = cloudinary;

// const uploadToCloudinary = cloudinary.uploader.upload()

//

//Multer storage cloudinary
//Amader folder -> image -> form data -> File -> Multer -> storage in cloudinary -> url ->  req.file  -> url  -> mongoose -> mongodb
