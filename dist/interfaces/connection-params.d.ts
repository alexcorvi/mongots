import { MongoClientOptions } from 'mongodb';
export interface ConnectionParams {
    url: string;
    options?: MongoClientOptions;
}
