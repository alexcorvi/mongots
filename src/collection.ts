import { Connect } from "./connect";
import { Filter, Keys, UpdateOperators, UpsertOperators } from "./interfaces";
import { Model } from "./model";
import * as MongoDB from "mongodb";

export function collectionConstructor(db: Connect) {
	return class CollectionC<S extends Model> {
		public _collectionName: string;

		constructor(collection: string) {
			this._collectionName = collection;
		}

		public async _collection() {
			return (await db.database()).collection<S>(this._collectionName);
		}

		/**
		 * Put one document
		 */
		public async createOne({ document }: { document: S }) {
			return (await this._collection()).insertOne(document);
		}

		/**
		 * Put multiple documents
		 */
		public async createMany({ documents }: { documents: S[] }) {
			return (await this._collection()).insertMany(documents);
		}

		/**
		 * Find documents that meets a specified criteria
		 */
		public async read({
			filter,
			skip,
			limit,
			sort = undefined,
		}: {
			filter?: Filter<S>;
			skip?: number;
			limit?: number;
			sort?: { key: string; direction: number };
		}) {
			filter = fixDeep(filter || {});
			const cursor = (await this._collection()).find<S>(filter);
			if (sort) {
				const sortObj: any = {};
				sortObj[sort.key] = sort.direction;
				cursor.sort(sortObj);
			}
			if (skip) {
				cursor.skip(skip);
			}
			if (limit) {
				cursor.limit(limit);
			}
			return await cursor.toArray();
		}

		/**
		 * Update many documents that meets the specified criteria
		 */
		public async updateMany({
			filter,
			update,
		}: {
			filter: Filter<S>;
			update: UpdateOperators<S>;
		}) {
			filter = fixDeep(filter || {});
			if (update.$set) {
				update.$set = fixDeep(update.$set);
			}
			if (update.$unset) {
				update.$unset = fixDeep(update.$unset);
			}
			update = fix$Pull$eq(update);
			return (await this._collection()).updateMany(filter, update as any);
		}

		/**
		 * Update one document that meets the specified criteria
		 */
		public async updateOne({
			filter,
			update,
		}: {
			filter: Filter<S>;
			update: UpdateOperators<S>;
		}) {
			filter = fixDeep(filter || {});
			update = fix$Pull$eq(update);
			if (update.$set) {
				update.$set = fixDeep(update.$set);
			}
			if (update.$unset) {
				update.$unset = fixDeep(update.$unset);
			}
			return (await this._collection()).updateOne(filter, update as any);
		}

		/**
		 * Replaces one document that meets the specified criteria
		 */
		public async replaceOne({
			filter,
			document,
			upsert,
		}: {
			filter: Filter<S>;
			document: S;
			upsert?: boolean;
		}) {
			filter = fixDeep(filter || {});
			delete document._id;
			return (await this._collection()).replaceOne(filter, document, {
				upsert,
			});
		}

		/**
		 * Update document(s) that meets the specified criteria,
		 * and do an insertion if no documents are matched
		 */
		public async upsert({
			filter,
			update,
			multi,
		}: {
			filter: Filter<S>;
			update: UpsertOperators<S>;
			multi?: boolean;
		}) {
			filter = fixDeep(filter || {});
			if (update.$set) {
				update.$set = fixDeep(update.$set);
			}
			if (update.$unset) {
				update.$unset = fixDeep(update.$unset);
			}
			const updateOperators = Object.keys(update);
			for (let index = 0; index < updateOperators.length; index++) {
				const updateOperator = updateOperators[index];
				if (updateOperator === "$setOnInsert") continue;
				const fields = Object.keys((update as any)[updateOperator]);
				for (let j = 0; j < fields.length; j++) {
					const field = fields[j];
					delete (update.$setOnInsert as any)[field];
				}
			}

			if (multi) {
				return (await this._collection()).updateMany(
					filter,
					update as any,
					{
						upsert: true,
					}
				);
			} else {
				return (await this._collection()).updateOne(
					filter,
					update as any,
					{
						upsert: true,
					}
				);
			}
		}

		/**
		 * Delete many documents that meets the specified criteria
		 *
		 */
		public async deleteMany({ filter }: { filter: Filter<S> }) {
			filter = fixDeep(filter || {});
			return (await this._collection()).deleteMany(filter);
		}

		/**
		 * Delete one document that meets the specified criteria
		 */
		public async deleteOne({ filter }: { filter: Filter<S> }) {
			filter = fixDeep(filter || {});
			return (await this._collection()).deleteOne(filter);
		}

		/**
		 * Count documents that meets the specified criteria
		 */
		public async count({
			filter,
			limit,
		}: {
			filter?: Filter<S>;
			limit?: number;
		}) {
			filter = fixDeep(filter || {});
			return await (await this._collection()).countDocuments(
				filter || {},
				{
					limit,
				}
			);
		}

		/**
		 * Returns a list of distinct values for the given key across a collection.
		 */
		public async readDistinct<T = keyof S>({
			key,
			filter,
		}: {
			key: Keys<S>;
			filter?: Filter<S>;
		}): Promise<T[]> {
			filter = fixDeep(filter || {});
			return await (await this._collection()).distinct(
				key.toString(),
				filter || {}
			);
		}

		/**
		 * Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
		 */
		public async drop({ name }: { name: string }): Promise<void> {
			return name === this._collectionName
				? await (await this._collection()).drop()
				: undefined;
		}

		/**
		 * Creates an index on the db and collection.
		 */
		public async createIndex({
			key,
			unique,
			sparse,
			background,
			dropDups,
		}: {
			key: Keys<S> | Keys<S>[];
			unique?: boolean;
			sparse?: boolean;
			background?: boolean;
			dropDups?: boolean;
		}) {
			return await (await this._collection()).createIndex(key, {
				unique,
				sparse,
				background,
				dropDups,
			});
		}

		/**
		 * Removes an index on the db and collection.
		 */
		public async removeIndex({ key }: { key: Keys<S> | Keys<S>[] }) {
			return await (await this._collection()).dropIndex(key as any);
		}

		/**
		 * Renames the collection
		 */
		public async rename({
			newName,
			dropTarget,
		}: {
			newName: string;
			dropTarget: boolean;
		}): Promise<void> {
			const r = await (await this._collection()).rename(newName, {
				dropTarget,
			});
			this._collectionName = newName;
			return;
		}

		/**
		 * Aliases
		 *
		 */
		find = this.read;
		insert = this.createOne;
		insertOne = this.createOne;
		insertMany = this.createMany;
		distinct = this.readDistinct;
		removeOne = this.deleteOne;
		removeMany = this.deleteMany;
	};
}

function fixDeep<T extends Filter<any>>(input: T): T {
	const result = Object.assign<T, Filter<any>>(input, input.$deep);
	delete result.$deep;
	return result;
}

function fix$Pull$eq(updateQuery: any) {
	if (updateQuery.$pull) {
		Object.keys(updateQuery.$pull).forEach((key) => {
			if (updateQuery.$pull[key].$eq) {
				updateQuery.$pull[key] = updateQuery.$pull[key].$eq;
			}
		});
	}
	return updateQuery;
}

export {
	MongoDB,
	Connect,
	Filter,
	Keys,
	UpdateOperators,
	UpsertOperators,
	Model,
};
