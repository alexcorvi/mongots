import { ConnectionParams } from "./interfaces";
import { Db } from "mongodb";
export declare class Connect {
    private connectionStr;
    private dbName;
    private options;
    private _database;
    constructor({ url, db, options }: ConnectionParams);
    database(): Promise<Db>;
    readonly Collection: {
        new <S extends import("./model").Model<any>>(collection: string): {
            _collectionName: string;
            _collection(): Promise<import("mongodb").Collection<any>>;
            createOne({ document }: {
                document: S;
            }): Promise<{
                ok: number;
                n: number;
            }>;
            createMany({ documents }: {
                documents: S[];
            }): Promise<{
                ok: number;
                n: number;
            }>;
            read({ filter, skip, limit, sort, }: {
                filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
                skip?: number | undefined;
                limit?: number | undefined;
                sort?: {
                    key: string;
                    direction: number;
                } | undefined;
            }): Promise<S[]>;
            updateMany({ filter, update, }: {
                filter: import("./collection").Filter<S>;
                update: import("./collection").UpdateOperators<S>;
            }): Promise<{
                ok: number;
                n: number;
                nModified: number;
            }>;
            updateOne({ filter, update, }: {
                filter: import("./collection").Filter<S>;
                update: import("./collection").UpdateOperators<S>;
            }): Promise<{
                ok: number;
                n: number;
                nModified: number;
            }>;
            replaceOne({ filter, document, upsert, }: {
                filter: import("./collection").Filter<S>;
                document: S;
                upsert?: boolean | undefined;
            }): Promise<{
                ok: number;
                n: number;
                nModified: number;
            }>;
            upsert({ filter, update, multi, }: {
                filter: import("./collection").Filter<S>;
                update: import("./collection").UpsertOperators<S>;
                multi?: boolean | undefined;
            }): Promise<{
                ok: number;
                n: number;
                nModified: number;
            }>;
            deleteMany({ filter }: {
                filter: import("./collection").Filter<S>;
            }): Promise<{
                ok?: number | undefined;
                n?: number | undefined;
            }>;
            deleteOne({ filter }: {
                filter: import("./collection").Filter<S>;
            }): Promise<{
                ok?: number | undefined;
                n?: number | undefined;
            }>;
            count({ filter, limit, }: {
                filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
                limit?: number | undefined;
            }): Promise<number>;
            readDistinct<T = keyof S>({ key, filter, }: {
                key: keyof S;
                filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
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
            removeIndex({ key }: {
                key: keyof S | (keyof S)[];
            }): Promise<any>;
            rename({ newName, dropTarget, }: {
                newName: string;
                dropTarget: boolean;
            }): Promise<void>;
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
            }) => Promise<{
                ok: number;
                n: number;
            }>;
            insertOne: ({ document }: {
                document: S;
            }) => Promise<{
                ok: number;
                n: number;
            }>;
            insertMany: ({ documents }: {
                documents: S[];
            }) => Promise<{
                ok: number;
                n: number;
            }>;
            distinct: <T = keyof S>({ key, filter, }: {
                key: keyof S;
                filter?: Partial<{ [key in keyof S]: S[key] | import("./interfaces/filter").FieldLevelQueryOperators<S[key]>; }> | import("./interfaces").TopLevelQueryOperators<S> | undefined;
            }) => Promise<T[]>;
            removeOne: ({ filter }: {
                filter: import("./collection").Filter<S>;
            }) => Promise<{
                ok?: number | undefined;
                n?: number | undefined;
            }>;
            removeMany: ({ filter }: {
                filter: import("./collection").Filter<S>;
            }) => Promise<{
                ok?: number | undefined;
                n?: number | undefined;
            }>;
        };
    };
}
