import { Database } from "./database";
import { ConnectionParams } from "./interfaces";
import { Filter, Keys, UpdateOperators, UpsertOperators } from "./interfaces";
import { Model } from "./model";
import * as MongoDB from "mongodb";

export class Collection<S extends Model> extends Database {
	public _collectionName: string;

	constructor(params: ConnectionParams & { collectionName: string }) {
		super(params);
		this._collectionName = params.collectionName;
	}

	public async _collection() {
		return (await this.database()).collection<any>(this._collectionName);
	}

	/**
	 * Put one document
	 */
	public async createOne({
		document,
	}: {
		document: S;
	}): Promise<MongoDB.InsertOneWriteOpResult<S>> {
		return await (await this._collection()).insertOne(document);
	}

	/**
	 * Put multiple documents
	 */
	public async createMany({
		documents,
	}: {
		documents: S[];
	}): Promise<MongoDB.InsertWriteOpResult<S>> {
		return await (await this._collection()).insertMany(documents);
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
	}): Promise<S[]> {
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
	}): Promise<MongoDB.UpdateWriteOpResult> {
		filter = fixDeep(filter || {});
		if (update.$set) {
			update.$set = fixDeep(update.$set);
		}
		if (update.$unset) {
			update.$unset = fixDeep(update.$unset);
		}
		update = fix$Pull$eq(update);
		return await (await this._collection()).updateMany(filter, update);
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
	}): Promise<MongoDB.UpdateWriteOpResult> {
		filter = fixDeep(filter || {});
		update = fix$Pull$eq(update);
		if (update.$set) {
			update.$set = fixDeep(update.$set);
		}
		if (update.$unset) {
			update.$unset = fixDeep(update.$unset);
		}
		return await (await this._collection()).updateOne(filter, update);
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
	}): Promise<MongoDB.ReplaceWriteOpResult> {
		filter = fixDeep(filter || {});
		delete document._id;
		return await (await this._collection()).replaceOne(filter, document, {
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
	}): Promise<MongoDB.UpdateWriteOpResult> {
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
			return await (await this._collection()).updateMany(filter, update, {
				upsert: true,
			});
		} else {
			return await (await this._collection()).updateOne(filter, update, {
				upsert: true,
			});
		}
	}

	/**
	 * Delete many documents that meets the specified criteria
	 *
	 */
	public async deleteMany({
		filter,
	}: {
		filter: Filter<S>;
	}): Promise<MongoDB.DeleteWriteOpResultObject> {
		filter = fixDeep(filter || {});
		return await (await this._collection()).deleteMany(filter);
	}

	/**
	 * Delete one document that meets the specified criteria
	 */
	public async deleteOne({
		filter,
	}: {
		filter: Filter<S>;
	}): Promise<MongoDB.DeleteWriteOpResultObject> {
		filter = fixDeep(filter || {});
		return await (await this._collection()).deleteOne(filter);
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
	}): Promise<number> {
		filter = fixDeep(filter || {});
		return await (await this._collection()).countDocuments(filter || {}, {
			limit,
		});
	}

	/**
	 * Returns a list of distinct values for the given key across a collection.
	 */
	public async readDistinct<Key extends keyof S>({
		key,
		filter,
	}: {
		key: Key;
		filter?: Filter<S>;
	}): Promise<S[Key][]> {
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
	public async createIndex<Key extends keyof S>({
		key,
		unique,
		sparse,
		background,
		dropDups,
	}: {
		key: Key | Key[];
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
	public async removeIndex<Key extends keyof S>({
		key,
	}: {
		key: Key | Key[];
	}) {
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

export { MongoDB, Filter, Keys, UpdateOperators, UpsertOperators, Model };
