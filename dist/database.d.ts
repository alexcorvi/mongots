import { ConnectionParams } from "./interfaces";
import { Db } from "mongodb";
export declare class Database {
    private connectionStr;
    private dbName;
    private options;
    private _database;
    constructor({ url, db, options }: ConnectionParams);
    /**
     * Perform database-level operations
     */
    database(): Promise<Db>;
}
