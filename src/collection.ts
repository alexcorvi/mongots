import { Connect } from './connect';
import {
	InsertWriteOpResult,
	UpdateWriteOpResult,
	DeleteWriteOpResultObject,
	Collection,
	InsertOneWriteOpResult
} from 'mongodb';

import {
	UpdateOperators,
	UpdateOperatorsModifiers,
	Filter,
	FieldLevelQueryOperators,
	TopLevelQueryOperators,
	Keys
} from './interfaces';

import * as I from './interfaces';

export function collectionConstructor(db: Connect) {
	return class CollectionC<Schema> {
		public _collectionName: string;

		constructor(collection: string) {
			this._collectionName = collection;
		}

		public async _collection() {
			return (await db.database()).collection(this._collectionName);
		}

		/**
		 * Put one document
		 */
		public async createOne({ document }: { document: Schema }) {
			return (await this._collection()).insertOne(document);
		}

		/**
		 * Put multiple documents
		 */
		public async createMany({ documents }: { documents: Schema[] }) {
			return (await this._collection()).insertMany(documents);
		}

		/**
		 * Find documents that meets a specified criteria
		 */
		public async read({
			filter,
			skip,
			limit,
			sort = undefined
		}: {
			filter?: Filter<Schema>;
			skip?: number;
			limit?: number;
			sort?: { key: string; direction: number };
		}) {
			filter = fixDeep(filter || {});
			const cursor = (await this._collection()).find<Schema>(filter);
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
		public async updateMany({ filter, update }: { filter: Filter<Schema>; update: UpdateOperators<Schema> }) {
			filter = fixDeep(filter || {});
			return (await this._collection()).updateMany(filter, update);
		}

		/**
		 * Update one document that meets the specified criteria
		 */
		public async updateOne({ filter, update }: { filter: Filter<Schema>; update: UpdateOperators<Schema> }) {
			filter = fixDeep(filter || {});
			return (await this._collection()).updateOne(filter, update);
		}

		/**
		 * Replaces one document that meets the specified criteria
		 */
		public async replaceOne({
			filter,
			document,
			upsert
		}: {
			filter: Filter<Schema>;
			document: Schema;
			upsert?: boolean;
		}) {
			filter = fixDeep(filter || {});
			return (await this._collection()).updateOne(filter, document, { upsert });
		}

		/**
		 * Delete many documents that meets the specified criteria
		 *
		 */
		public async deleteMany({ filter }: { filter: Filter<Schema> }) {
			filter = fixDeep(filter || {});
			return (await this._collection()).deleteMany(filter);
		}

		/**
		 * Delete one document that meets the specified criteria
		 */
		public async deleteOne({ filter }: { filter: Filter<Schema> }) {
			filter = fixDeep(filter || {});
			return (await this._collection()).deleteOne(filter);
		}

		/**
		 * Count documents that meets the specified criteria
		 */
		public async count({ filter, limit }: { filter?: Filter<Schema>; limit?: number }) {
			filter = fixDeep(filter || {});
			return await (await this._collection()).count(filter || {}, { limit });
		}

		/**
		 * Returns a list of distinct values for the given key across a collection.
		 */
		public async readDistinct<Type>({
			key,
			filter
		}: {
			key: Keys<Schema>;
			filter?: Filter<Schema>;
		}): Promise<Type[]> {
			filter = fixDeep(filter || {});
			return await (await this._collection()).distinct(key, filter || {});
		}

		/**
		 * Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
		 */
		public async drop({ name }: { name: string }): Promise<void> {
			return name === this._collectionName ? await (await this._collection()).drop() : undefined;
		}

		/**
		 * Creates an index on the db and collection.
		 */
		public async createIndex({
			key,
			unique,
			sparse,
			background,
			dropDups
		}: {
			key: Keys<Schema> | Keys<Schema>[];
			unique?: boolean;
			sparse?: boolean;
			background?: boolean;
			dropDups?: boolean;
		}) {
			return await (await this._collection()).createIndex(key, { unique, sparse, background, dropDups });
		}

		/**
		 * Renames the collection
		 */
		public async rename({ newName, dropTarget }: { newName: string; dropTarget: boolean }): Promise<void> {
			const r = await (await this._collection()).rename(newName, { dropTarget });
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

function fixDeep<T extends { $deep?: any }>(input: T): T {
	const result = Object.assign<T, Filter<any>>(input, input.$deep);
	delete result.$deep;
	return result;
}
