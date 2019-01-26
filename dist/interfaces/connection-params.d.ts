import { MongoClientOptions } from "mongodb";
export interface ConnectionParams {
    url: string;
    db: string;
    options?: MongoClientOptions;
}
