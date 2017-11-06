import { Db, InsertWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject, Collection, InsertOneWriteOpResult } from 'mongodb';
import { FieldLevelQueryOperators, UpdateOperators, TopLevelQueryOperators, ConnectionParams } from './interfaces';
export declare class Connect {
    private url;
    private options;
    private _database;
    constructor({url, options}: ConnectionParams);
    private _connect();
    readonly collection: {
        new <Schema>(collection: string): {
            _collectionName: string;
            _collection(): Promise<Collection<any>>;
            createOne({document}: {
                document: Schema;
            }): Promise<InsertOneWriteOpResult>;
            createMany({documents}: {
                documents: Schema[];
            }): Promise<InsertWriteOpResult>;
            read({filter, skip, limit, sort}: {
                filter?: ({
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>) | undefined;
                skip?: number | undefined;
                limit?: number | undefined;
                sort?: {
                    key: string;
                    direction: number;
                } | undefined;
            }): Promise<Schema[]>;
            updateMany({filter, update}: {
                filter: {
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>;
                update: UpdateOperators<Schema>;
            }): Promise<UpdateWriteOpResult>;
            updateOne({filter, update}: {
                filter: {
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>;
                update: UpdateOperators<Schema>;
            }): Promise<UpdateWriteOpResult>;
            replaceOne({filter, document, upsert}: {
                filter: {
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>;
                document: Schema;
                upsert?: boolean | undefined;
            }): Promise<UpdateWriteOpResult>;
            deleteMany({filter}: {
                filter: {
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>;
            }): Promise<DeleteWriteOpResultObject>;
            deleteOne({filter}: {
                filter: {
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>;
            }): Promise<DeleteWriteOpResultObject>;
            count({filter, limit}: {
                filter?: ({
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>) | undefined;
                limit?: number | undefined;
            }): Promise<number>;
            readDistinct<Type>({key, filter}: {
                key: keyof Schema;
                filter?: ({
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>) | undefined;
            }): Promise<Type[]>;
            drop({name}: {
                name: string;
            }): Promise<void>;
            createIndex({key, unique, sparse, background, dropDups}: {
                key: (keyof Schema) | (keyof Schema)[];
                unique?: boolean | undefined;
                sparse?: boolean | undefined;
                background?: boolean | undefined;
                dropDups?: boolean | undefined;
            }): Promise<string>;
            rename({newName, dropTarget}: {
                newName: string;
                dropTarget: boolean;
            }): Promise<void>;
            find: ({filter, skip, limit, sort}: {
                filter?: ({
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>) | undefined;
                skip?: number | undefined;
                limit?: number | undefined;
                sort?: {
                    key: string;
                    direction: number;
                } | undefined;
            }) => Promise<Schema[]>;
            insert: ({document}: {
                document: Schema;
            }) => Promise<InsertOneWriteOpResult>;
            insertOne: ({document}: {
                document: Schema;
            }) => Promise<InsertOneWriteOpResult>;
            insertMany: ({documents}: {
                documents: Schema[];
            }) => Promise<InsertWriteOpResult>;
            distinct: <Type>({key, filter}: {
                key: keyof Schema;
                filter?: ({
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>) | undefined;
            }) => Promise<Type[]>;
            removeOne: ({filter}: {
                filter: {
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>;
            }) => Promise<DeleteWriteOpResultObject>;
            removeMany: ({filter}: {
                filter: {
                    [P in keyof Schema]?: {
                        [key in keyof Schema]: Schema[key] | FieldLevelQueryOperators<Schema[key]>;
                    }[P] | undefined;
                } & TopLevelQueryOperators<Schema>;
            }) => Promise<DeleteWriteOpResultObject>;
        };
    };
    database(): Promise<Db>;
}
