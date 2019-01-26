import { Connect } from "./connect";
import { InsertWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject, Collection, InsertOneWriteOpResult } from "mongodb";
import { UpdateOperators, Filter } from "./interfaces";
export declare function collectionConstructor(db: Connect): {
    new <Schema>(collection: string): {
        _collectionName: string;
        _collection(): Promise<Collection<any>>;
        /**
         * Put one document
         */
        createOne({ document }: {
            document: Schema;
        }): Promise<InsertOneWriteOpResult>;
        /**
         * Put multiple documents
         */
        createMany({ documents }: {
            documents: Schema[];
        }): Promise<InsertWriteOpResult>;
        /**
         * Find documents that meets a specified criteria
         */
        read({ filter, skip, limit, sort }: {
            filter?: Filter<Schema> | undefined;
            skip?: number | undefined;
            limit?: number | undefined;
            sort?: {
                key: string;
                direction: number;
            } | undefined;
        }): Promise<Schema[]>;
        /**
         * Update many documents that meets the specified criteria
         */
        updateMany({ filter, update }: {
            filter: Filter<Schema>;
            update: UpdateOperators<Schema>;
        }): Promise<UpdateWriteOpResult>;
        /**
         * Update one document that meets the specified criteria
         */
        updateOne({ filter, update }: {
            filter: Filter<Schema>;
            update: UpdateOperators<Schema>;
        }): Promise<UpdateWriteOpResult>;
        /**
         * Replaces one document that meets the specified criteria
         */
        replaceOne({ filter, document, upsert }: {
            filter: Filter<Schema>;
            document: Schema;
            upsert?: boolean | undefined;
        }): Promise<UpdateWriteOpResult>;
        /**
         * Delete many documents that meets the specified criteria
         *
         */
        deleteMany({ filter }: {
            filter: Filter<Schema>;
        }): Promise<DeleteWriteOpResultObject>;
        /**
         * Delete one document that meets the specified criteria
         */
        deleteOne({ filter }: {
            filter: Filter<Schema>;
        }): Promise<DeleteWriteOpResultObject>;
        /**
         * Count documents that meets the specified criteria
         */
        count({ filter, limit }: {
            filter?: Filter<Schema> | undefined;
            limit?: number | undefined;
        }): Promise<number>;
        /**
         * Returns a list of distinct values for the given key across a collection.
         */
        readDistinct<Type>({ key, filter }: {
            key: keyof Schema;
            filter?: Filter<Schema> | undefined;
        }): Promise<Type[]>;
        /**
         * Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
         */
        drop({ name }: {
            name: string;
        }): Promise<void>;
        /**
         * Creates an index on the db and collection.
         */
        createIndex({ key, unique, sparse, background, dropDups }: {
            key: keyof Schema | (keyof Schema)[];
            unique?: boolean | undefined;
            sparse?: boolean | undefined;
            background?: boolean | undefined;
            dropDups?: boolean | undefined;
        }): Promise<string>;
        /**
         * Renames the collection
         */
        rename({ newName, dropTarget }: {
            newName: string;
            dropTarget: boolean;
        }): Promise<void>;
        /**
         * Aliases
         *
         */
        find: ({ filter, skip, limit, sort }: {
            filter?: Filter<Schema> | undefined;
            skip?: number | undefined;
            limit?: number | undefined;
            sort?: {
                key: string;
                direction: number;
            } | undefined;
        }) => Promise<Schema[]>;
        insert: ({ document }: {
            document: Schema;
        }) => Promise<InsertOneWriteOpResult>;
        insertOne: ({ document }: {
            document: Schema;
        }) => Promise<InsertOneWriteOpResult>;
        insertMany: ({ documents }: {
            documents: Schema[];
        }) => Promise<InsertWriteOpResult>;
        distinct: <Type>({ key, filter }: {
            key: keyof Schema;
            filter?: Filter<Schema> | undefined;
        }) => Promise<Type[]>;
        removeOne: ({ filter }: {
            filter: Filter<Schema>;
        }) => Promise<DeleteWriteOpResultObject>;
        removeMany: ({ filter }: {
            filter: Filter<Schema>;
        }) => Promise<DeleteWriteOpResultObject>;
    };
};
