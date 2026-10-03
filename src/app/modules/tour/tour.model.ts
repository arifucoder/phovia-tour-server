import { model, Schema, type Types } from "mongoose";
import type { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
	{
		name: { type: String, required: true, unique: true },
	},
	{
		timestamps: true,
	},
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
	{
		title: { type: String, required: true },
		slug: { type: String, unique: true },
		description: { type: String },
		images: { type: [String], default: [] },
		location: { type: String },
		costFrom: { type: Number },
		startDate: { type: Date },
		endDate: { type: Date },
		departureLocation: { type: String },
		arrivalLocation: { type: String },
		included: { type: [String], default: [] },
		excluded: { type: [String], default: [] },
		amenities: { type: [String], default: [] },
		tourPlan: { type: [String], default: [] },
		maxGuest: { type: Number },
		minAge: { type: Number },
		division: {
			type: Schema.Types.ObjectId,
			ref: "Division",
			required: true,
		},
		tourType: {
			type: Schema.Types.ObjectId,
			ref: "TourType",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const generateUniqueSlug = async (title: string, excludeId?: Types.ObjectId) => {
	const baseSlug = title.trim().toLowerCase().split(/\s+/).join("-");
	let slug = baseSlug;
	let counter = 1;

	while (
		await Tour.exists({
			slug,
			...(excludeId ? { _id: { $ne: excludeId } } : {}),
		})
	) {
		slug = `${baseSlug}-${counter++}`; // cox-bazar-tour-1, cox-bazar-tour-2
	}

	return slug;
};

tourSchema.pre("save", async function () {
	if (this.isModified("title")) {
		this.slug = await generateUniqueSlug(this.title, this._id);
	}
});

tourSchema.pre("findOneAndUpdate", async function () {
	const update = this.getUpdate() as Record<string, any>;
	const title = update?.title ?? update?.$set?.title;

	if (title) {
		const existing = await this.model.findOne(this.getQuery()).select("_id");
		const slug = await generateUniqueSlug(title, existing?._id);

		if (update.$set) update.$set.slug = slug;
		else update.slug = slug;

		this.setUpdate(update);
	}
});

export const Tour = model<ITour>("Tour", tourSchema);
