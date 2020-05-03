import { ConnectionParams } from "./interfaces";
import { Db } from "mongodb";
export declare class Connect {
    private connectionStr;
    private dbName;
    private options;
    private _database;
    constructor({ url, db, options }: ConnectionParams);
    database(): Promise<Db>;
    get Collection(): {
        new <S extends import("./model").Model<any>>(collection: string): {
            _collectionName: string;
            _collection(): Promise<import("mongodb").Collection<S>>;
            createOne({ document }: {
                document: S;
            }): Promise<import("mongodb").InsertOneWriteOpResult>;
            createMany({ documents }: {
                documents: S[];
            }): Promise<import("mongodb").InsertWriteOpResult>;
            read({ filter, skip, limit, sort, }: {
                filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
                skip?: number | undefined;
                limit?: number | undefined;
                sort?: {
                    key: string;
                    direction: number;
                } | undefined;
            }): Promise<S[]>;
            updateMany({ filter, update, }: {
                filter: import("./interfaces").Filter<S>;
                update: import("./interfaces").UpdateOperators<S>;
            }): Promise<import("mongodb").UpdateWriteOpResult>;
            updateOne({ filter, update, }: {
                filter: import("./interfaces").Filter<S>;
                update: import("./interfaces").UpdateOperators<S>;
            }): Promise<import("mongodb").UpdateWriteOpResult>;
            replaceOne({ filter, document, upsert, }: {
                filter: import("./interfaces").Filter<S>;
                document: S;
                upsert?: boolean | undefined;
            }): Promise<import("mongodb").ReplaceWriteOpResult>;
            upsert({ filter, update, multi, }: {
                filter: import("./interfaces").Filter<S>;
                update: import("./interfaces").UpsertOperators<S>;
                multi?: boolean | undefined;
            }): Promise<import("mongodb").UpdateWriteOpResult>;
            deleteMany({ filter }: {
                filter: import("./interfaces").Filter<S>;
            }): Promise<import("mongodb").DeleteWriteOpResultObject>;
            deleteOne({ filter }: {
                filter: import("./interfaces").Filter<S>;
            }): Promise<import("mongodb").DeleteWriteOpResultObject>;
            count({ filter, limit, }: {
                filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
                limit?: number | undefined;
            }): Promise<number>;
            readDistinct<T = keyof S>({ key, filter, }: {
                key: keyof S;
                filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
            }): Promise<T[]>;
            drop({ name }: {
                name: string;
            }): Promise<void>;
            createIndex({ key, unique, sparse, background, dropDups, }: {
                key: keyof S | (keyof S)[];
                unique?: boolean | undefined;
                sparse?: boolean | undefined;
                background?: boolean | undefined;
                dropDups?: boolean | undefined;
            }): Promise<string>;
            rename({ newName, dropTarget, }: {
                newName: string;
                dropTarget: boolean;
            }): Promise<void>;
            find: ({ filter, skip, limit, sort, }: {
                filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
                skip?: number | undefined;
                limit?: number | undefined;
                sort?: {
                    key: string;
                    direction: number;
                } | undefined;
            }) => Promise<S[]>;
            insert: ({ document }: {
                document: S;
            }) => Promise<import("mongodb").InsertOneWriteOpResult>;
            insertOne: ({ document }: {
                document: S;
            }) => Promise<import("mongodb").InsertOneWriteOpResult>;
            insertMany: ({ documents }: {
                documents: S[];
            }) => Promise<import("mongodb").InsertWriteOpResult>;
            distinct: <T = keyof S>({ key, filter, }: {
                key: keyof S;
                filter?: import("./interfaces").Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
            }) => Promise<T[]>;
            removeOne: ({ filter }: {
                filter: import("./interfaces").Filter<S>;
            }) => Promise<import("mongodb").DeleteWriteOpResultObject>;
            removeMany: ({ filter }: {
                filter: import("./interfaces").Filter<S>;
            }) => Promise<import("mongodb").DeleteWriteOpResultObject>;
        };
    };
}
