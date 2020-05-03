import { Connect } from "./connect";
import { UpsertOperators } from "./interfaces/update";
import { Model } from "./model";
import { InsertWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject, Collection, InsertOneWriteOpResult } from "mongodb";
import { UpdateOperators, Filter, TopLevelQueryOperators } from "./interfaces";
export declare function collectionConstructor(db: Connect): {
    new <S extends Model<any>>(collection: string): {
        _collectionName: string;
        _collection(): Promise<Collection<S>>;
        /**
         * Put one document
         */
        createOne({ document }: {
            document: S;
        }): Promise<InsertOneWriteOpResult>;
        /**
         * Put multiple documents
         */
        createMany({ documents }: {
            documents: S[];
        }): Promise<InsertWriteOpResult>;
        /**
         * Find documents that meets a specified criteria
         */
        read({ filter, skip, limit, sort, }: {
            filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | TopLevelQueryOperators<S> | undefined;
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
        }): Promise<UpdateWriteOpResult>;
        /**
         * Update one document that meets the specified criteria
         */
        updateOne({ filter, update, }: {
            filter: Filter<S>;
            update: UpdateOperators<S>;
        }): Promise<UpdateWriteOpResult>;
        /**
         * Replaces one document that meets the specified criteria
         */
        replaceOne({ filter, document, upsert, }: {
            filter: Filter<S>;
            document: S;
            upsert?: boolean | undefined;
        }): Promise<import("mongodb").ReplaceWriteOpResult>;
        /**
         * Update document(s) that meets the specified criteria,
         * and do an insertion if no documents are matched
         */
        upsert({ filter, update, multi, }: {
            filter: Filter<S>;
            update: UpsertOperators<S>;
            multi?: boolean | undefined;
        }): Promise<UpdateWriteOpResult>;
        /**
         * Delete many documents that meets the specified criteria
         *
         */
        deleteMany({ filter }: {
            filter: Filter<S>;
        }): Promise<DeleteWriteOpResultObject>;
        /**
         * Delete one document that meets the specified criteria
         */
        deleteOne({ filter }: {
            filter: Filter<S>;
        }): Promise<DeleteWriteOpResultObject>;
        /**
         * Count documents that meets the specified criteria
         */
        count({ filter, limit, }: {
            filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | TopLevelQueryOperators<S> | undefined;
            limit?: number | undefined;
        }): Promise<number>;
        /**
         * Returns a list of distinct values for the given key across a collection.
         */
        readDistinct<T = keyof S>({ key, filter, }: {
            key: keyof S;
            filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | TopLevelQueryOperators<S> | undefined;
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
            filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | TopLevelQueryOperators<S> | undefined;
            skip?: number | undefined;
            limit?: number | undefined;
            sort?: {
                key: string;
                direction: number;
            } | undefined;
        }) => Promise<S[]>;
        insert: ({ document }: {
            document: S;
        }) => Promise<InsertOneWriteOpResult>;
        insertOne: ({ document }: {
            document: S;
        }) => Promise<InsertOneWriteOpResult>;
        insertMany: ({ documents }: {
            documents: S[];
        }) => Promise<InsertWriteOpResult>;
        distinct: <T = keyof S>({ key, filter, }: {
            key: keyof S;
            filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | TopLevelQueryOperators<S> | undefined;
        }) => Promise<T[]>;
        removeOne: ({ filter }: {
            filter: Filter<S>;
        }) => Promise<DeleteWriteOpResultObject>;
        removeMany: ({ filter }: {
            filter: Filter<S>;
        }) => Promise<DeleteWriteOpResultObject>;
    };
};
