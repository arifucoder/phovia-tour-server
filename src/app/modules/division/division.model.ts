import { model, Schema } from "mongoose";
import type { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
	{
		name: { type: String, required: true, unique: true },
		slug: { type: String, unique: true },
		thumbnail: { type: String },
		description: { type: String },
	},
	{ timestamps: true },
);

const generateUniqueSlug = async (name: string, excludeId?: unknown) => {
	const baseSlug = `${name.trim().toLowerCase().split(/\s+/).join("-")}-division`;
	let slug = baseSlug;
	let counter = 1;

	while (
		await Division.exists({
			slug,
			...(excludeId ? { _id: { $ne: excludeId } } : {}),
		})
	) {
		slug = `${baseSlug}-${counter++}`; // dhaka-division-1, dhaka-division-2
	}

	return slug;
};

divisionSchema.pre("save", async function () {
	if (this.isModified("name")) {
		this.slug = await generateUniqueSlug(this.name, this._id);
	}
});

divisionSchema.pre("findOneAndUpdate", async function () {
	const update = this.getUpdate() as Record<string, any>;
	const name = update?.name ?? update?.$set?.name;

	if (name) {
		const existing = await this.model.findOne(this.getQuery()).select("_id");
		const slug = await generateUniqueSlug(name, existing?._id);

		if (update.$set) update.$set.slug = slug;
		else update.slug = slug;

		this.setUpdate(update);
	}
});

export const Division = model<IDivision>("Division", divisionSchema);
