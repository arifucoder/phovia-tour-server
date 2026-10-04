import { QueryBuilder } from "../../utils/QueryBuilder";
import { QueryBuilderProvia } from "../../utils/QueryBuilderProvia";
import { tourSearchableFields } from "./tour.constant";
import type { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: ITour) => {
	const existingTour = await Tour.findOne({ title: payload.title });
	if (existingTour) {
		throw new Error("A tour with this title already exists.");
	}

	// const baseSlug = payload.title.toLowerCase().split(" ").join("-")
	// let slug = `${baseSlug}`

	// let counter = 0;
	// while (await Tour.exists({ slug })) {
	//     slug = `${slug}-${counter++}` // dhaka-division-2
	// }

	// payload.slug = slug;

	const tour = await Tour.create(payload);

	return tour;
};

// const getAllToursOld = async (query: Record<string, string>) => {
// 	console.log(query);
// 	const filter = query;
// 	const searchTerm = query.searchTerm || "";
// 	const sort = query.sort || "-createdAt";
// 	const fields = query.fields?.split(",").join(" ") || "";
// 	const page = Number(query.page) || 1;
// 	const limit = Number(query.limit) || 10;
// 	const skip = (page - 1) * limit;

// 	// delete filter["searchTerm"];
// 	// delete filter["sort"];

// 	const excludeField = ["searchTerm", "sort", "fields", "page", "limit"];
// 	for (const field of excludeField) {
// 		delete filter[field];
// 	}

// 	// const tourSearchableFields = ["title", "description", "location"];

// 	const searchQuery = {
// 		$or: tourSearchableFields.map((field) => ({ [field]: { $regex: searchTerm, $options: "i" } })),
// 	};

// 	// const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);

// 	const filterQuery = Tour.find(filter);
// 	const tours = filterQuery.find(searchQuery);
// 	const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit);

// 	const totalTours = await Tour.countDocuments();
// 	const totalPage = Math.ceil(totalTours / limit);

// 	const meta = {
// 		page,
// 		limit,
// 		total: totalTours,
// 		totalPage,
// 	};

// 	return {
// 		data: allTours,
// 		meta,
// 	};
// };

const getAllToursOld = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilderProvia(Tour.find(), query);

	const tours = await queryBuilder.search(tourSearchableFields).filter().sort().fields().paginate();

	const [data, meta] = await Promise.all([tours.build(), queryBuilder.getMeta()]);

	return {
		data,
		meta,
	};
};

const getAllTours = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(Tour.find(), query);

	const tours = await queryBuilder.search(tourSearchableFields).filter().sort().fields().paginate();

	// const meta = await queryBuilder.getMeta()

	const [data, meta] = await Promise.all([tours.build(), queryBuilder.getMeta()]);

	return {
		data,
		meta,
	};
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
	const existingTour = await Tour.findById(id);

	if (!existingTour) {
		throw new Error("Tour not found.");
	}

	// if (payload.title) {
	//     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
	//     let slug = `${baseSlug}`

	//     let counter = 0;
	//     while (await Tour.exists({ slug })) {
	//         slug = `${slug}-${counter++}` // dhaka-division-2
	//     }

	//     payload.slug = slug
	// }

	const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

	return updatedTour;
};

const deleteTour = async (id: string) => {
	return await Tour.findByIdAndDelete(id);
};

const createTourType = async (payload: ITourType) => {
	const existingTourType = await TourType.findOne({ name: payload.name });

	if (existingTourType) {
		throw new Error("Tour type already exists.");
	}

	return await TourType.create({ name: payload.name });
};
const getAllTourTypes = async () => {
	return await TourType.find();
};
const updateTourType = async (id: string, payload: ITourType) => {
	const existingTourType = await TourType.findById(id);
	if (!existingTourType) {
		throw new Error("Tour type not found.");
	}

	const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
	return updatedTourType;
};
const deleteTourType = async (id: string) => {
	const existingTourType = await TourType.findById(id);
	if (!existingTourType) {
		throw new Error("Tour type not found.");
	}

	return await TourType.findByIdAndDelete(id);
};

export const TourService = {
	createTour,
	createTourType,
	deleteTourType,
	updateTourType,
	getAllTourTypes,
	getAllTours,
	updateTour,
	deleteTour,
	getAllToursOld,
};
