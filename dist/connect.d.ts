import { Collection } from "./collection";
import { ConnectionParams } from "./interfaces";
import { Model } from "./model";
import { Db } from "mongodb";
export declare class Connect {
    private connectionStr;
    private dbName;
    private options;
    private _database;
    constructor({ url, db, options }: ConnectionParams);
    /**
     * Perform database-level operations
     */
    database(): Promise<Db>;
    /**
     * Perform collection-level operations
     */
    collection<Schema extends Model>(name: string): Collection<Schema>;
}
