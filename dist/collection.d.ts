import { Connect } from "./connect";
import { Filter, Keys, UpdateOperators, UpsertOperators } from "./interfaces";
import { Model } from "./model";
import * as MongoDB from "mongodb";
export declare function collectionConstructor(db: Connect): {
    new <S extends Model<any>>(collection: string): {
        _collectionName: string;
        _collection(): Promise<MongoDB.Collection<S>>;
        /**
         * Put one document
         */
        createOne({ document }: {
            document: S;
        }): Promise<MongoDB.InsertOneWriteOpResult>;
        /**
         * Put multiple documents
         */
        createMany({ documents }: {
            documents: S[];
        }): Promise<MongoDB.InsertWriteOpResult>;
        /**
         * Find documents that meets a specified criteria
         */
        read({ filter, skip, limit, sort, }: {
            filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
            skip?: number | undefined;
            limit?: number | undefined;
            sort?: {
                key: string;
                direction: number;
            } | undefined;
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
        updateOne({ filter, update, }: {
            filter: Filter<S>;
            update: UpdateOperators<S>;
        }): Promise<MongoDB.UpdateWriteOpResult>;
        /**
         * Replaces one document that meets the specified criteria
         */
        replaceOne({ filter, document, upsert, }: {
            filter: Filter<S>;
            document: S;
            upsert?: boolean | undefined;
        }): Promise<MongoDB.ReplaceWriteOpResult>;
        /**
         * Update document(s) that meets the specified criteria,
         * and do an insertion if no documents are matched
         */
        upsert({ filter, update, multi, }: {
            filter: Filter<S>;
            update: UpsertOperators<S>;
            multi?: boolean | undefined;
        }): Promise<MongoDB.UpdateWriteOpResult>;
        /**
         * Delete many documents that meets the specified criteria
         *
         */
        deleteMany({ filter }: {
            filter: Filter<S>;
        }): Promise<MongoDB.DeleteWriteOpResultObject>;
        /**
         * Delete one document that meets the specified criteria
         */
        deleteOne({ filter }: {
            filter: Filter<S>;
        }): Promise<MongoDB.DeleteWriteOpResultObject>;
        /**
         * Count documents that meets the specified criteria
         */
        count({ filter, limit, }: {
            filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
            limit?: number | undefined;
        }): Promise<number>;
        /**
         * Returns a list of distinct values for the given key across a collection.
         */
        readDistinct<T = keyof S>({ key, filter, }: {
            key: keyof S;
            filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
        }): Promise<T[]>;
        /**
         * Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
         */
        drop({ name }: {
            name: string;
        }): Promise<void>;
        /**
         * Creates an index on the db and collection.
         */
        createIndex({ key, unique, sparse, background, dropDups, }: {
            key: keyof S | (keyof S)[];
            unique?: boolean | undefined;
            sparse?: boolean | undefined;
            background?: boolean | undefined;
            dropDups?: boolean | undefined;
        }): Promise<string>;
        /**
         * Removes an index on the db and collection.
         */
        removeIndex({ key }: {
            key: keyof S | (keyof S)[];
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
        insert: ({ document }: {
            document: S;
        }) => Promise<MongoDB.InsertOneWriteOpResult>;
        insertOne: ({ document }: {
            document: S;
        }) => Promise<MongoDB.InsertOneWriteOpResult>;
        insertMany: ({ documents }: {
            documents: S[];
        }) => Promise<MongoDB.InsertWriteOpResult>;
        distinct: <T = keyof S>({ key, filter, }: {
            key: keyof S;
            filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
        }) => Promise<T[]>;
        removeOne: ({ filter }: {
            filter: Filter<S>;
        }) => Promise<MongoDB.DeleteWriteOpResultObject>;
        removeMany: ({ filter }: {
            filter: Filter<S>;
        }) => Promise<MongoDB.DeleteWriteOpResultObject>;
    };
};
export { MongoDB, Connect, Filter, Keys, UpdateOperators, UpsertOperators, Model, };
