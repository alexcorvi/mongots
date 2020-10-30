import { Database } from "./database";
import { ConnectionParams } from "./interfaces";
import { Filter, Keys, UpdateOperators, UpsertOperators } from "./interfaces";
import { Model } from "./model";
import * as MongoDB from "mongodb";
export declare class Collection<S extends Model> extends Database {
    _collectionName: string;
    constructor(params: ConnectionParams & {
        collectionName: string;
    });
    _collection(): Promise<MongoDB.Collection<any>>;
    /**
         * Execute an aggregation framework pipeline against the collection, needs MongoDB >= 2.2
         */
    aggregate<T>({ pipeline, options }: {
        pipeline: object[];
        options?: MongoDB.CollectionAggregationOptions;
    }): Promise<T[]>;
    /**
     * Put one document
     */
    createOne({ document, }: {
        document: S;
    }): Promise<MongoDB.InsertOneWriteOpResult<S>>;
    /**
     * Put multiple documents
     */
    createMany({ documents, }: {
        documents: S[];
    }): Promise<MongoDB.InsertWriteOpResult<S>>;
    /**
     * Find one document
     */
    findOne({ filter, skip, limit, sort, }: {
        filter?: Filter<S>;
        skip?: number;
        limit?: number;
        sort?: {
            key: string;
            direction: number;
        };
    }): Promise<S | any>;
    /**
     * Find documents that meets a specified criteria
     */
    read({ filter, skip, limit, sort, }: {
        filter?: Filter<S>;
        skip?: number;
        limit?: number;
        sort?: {
            key: string;
            direction: number;
        };
    }): Promise<S[]>;
    /**
     * Update many documents that meets the specified criteria
     */
    updateMany({ filter, update, }: {
        filter: Filter<S>;
        update: UpdateOperators<S>;
    }): Promise<MongoDB.UpdateWriteOpResult>;
    /**
     * Update one document that meets the specified criteria
     */
    updateOne({ filter, update, options }: {
        filter: Filter<S>;
        update: UpdateOperators<S>;
        options?: {
            upsert: boolean;
        };
    }): Promise<MongoDB.UpdateWriteOpResult>;
    /**
     * Replaces one document that meets the specified criteria
     */
    replaceOne({ filter, document, upsert, }: {
        filter: Filter<S>;
        document: S;
        upsert?: boolean;
    }): Promise<MongoDB.ReplaceWriteOpResult>;
    /**
     * Update document(s) that meets the specified criteria,
     * and do an insertion if no documents are matched
     */
    upsert({ filter, update, multi, }: {
        filter: Filter<S>;
        update: UpsertOperators<S>;
        multi?: boolean;
    }): Promise<MongoDB.UpdateWriteOpResult>;
    /**
     * Delete many documents that meets the specified criteria
     *
     */
    deleteMany({ filter, }: {
        filter: Filter<S>;
    }): Promise<MongoDB.DeleteWriteOpResultObject>;
    /**
     * Delete one document that meets the specified criteria
     */
    deleteOne({ filter, }: {
        filter: Filter<S>;
    }): Promise<MongoDB.DeleteWriteOpResultObject>;
    /**
     * Count documents that meets the specified criteria
     */
    count({ filter, limit, }: {
        filter?: Filter<S>;
        limit?: number;
    }): Promise<number>;
    /**
     * Returns a list of distinct values for the given key across a collection.
     */
    readDistinct<Key extends keyof S>({ key, filter, }: {
        key: Key;
        filter?: Filter<S>;
    }): Promise<S[Key][]>;
    /**
     * Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
     */
    drop({ name }: {
        name: string;
    }): Promise<void>;
    /**
     * Creates an index on the db and collection.
     */
    createIndex<Key extends keyof S>({ key, unique, sparse, background, dropDups, }: {
        key: Key | Key[];
        unique?: boolean;
        sparse?: boolean;
        background?: boolean;
        dropDups?: boolean;
    }): Promise<string>;
    /**
     * Removes an index on the db and collection.
     */
    removeIndex<Key extends keyof S>({ key, }: {
        key: Key | Key[];
    }): Promise<any>;
    /**
     * Renames the collection
     */
    rename({ newName, dropTarget, }: {
        newName: string;
        dropTarget: boolean;
    }): Promise<void>;
    /**
     * Aliases
     *
     */
    find: ({ filter, skip, limit, sort, }: {
        filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
        skip?: number | undefined;
        limit?: number | undefined;
        sort?: {
            key: string;
            direction: number;
        } | undefined;
    }) => Promise<S[]>;
    insert: ({ document, }: {
        document: S;
    }) => Promise<MongoDB.InsertOneWriteOpResult<S>>;
    insertOne: ({ document, }: {
        document: S;
    }) => Promise<MongoDB.InsertOneWriteOpResult<S>>;
    insertMany: ({ documents, }: {
        documents: S[];
    }) => Promise<MongoDB.InsertWriteOpResult<S>>;
    distinct: <Key extends keyof S>({ key, filter, }: {
        key: Key;
        filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
    }) => Promise<S[Key][]>;
    removeOne: ({ filter, }: {
        filter: Filter<S>;
    }) => Promise<MongoDB.DeleteWriteOpResultObject>;
    removeMany: ({ filter, }: {
        filter: Filter<S>;
    }) => Promise<MongoDB.DeleteWriteOpResultObject>;
}
export { MongoDB, Filter, Keys, UpdateOperators, UpsertOperators, Model };
