import type { Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilderProvia<T> {
	public modelQuery: Query<T[]>;
	public readonly query: Record<string, string>;

	constructor(modelQuery: Query<T[]>, query: Record<string, string>) {
		this.modelQuery = modelQuery;
		this.query = query;
	}

	filter(): any {
		const filter = { ...this.query };

		for (const field of excludeField) {
			delete filter[field];
		}

		this.modelQuery = this.modelQuery.find(filter);

		return this;
	}

	search(searchableField: string[]): this {
		const searchTerm = this.query.searchTerm || "";

		const searchQuery = {
			$or: searchableField.map((field) => ({
				[field]: {
					$regex: searchTerm,
					$options: "i",
				},
			})),
		};

		this.modelQuery = this.modelQuery.find(searchQuery);

		return this;
	}
}
