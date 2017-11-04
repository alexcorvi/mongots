import {
	Db,
	MongoClientOptions,
	connect,
	InsertWriteOpResult,
	UpdateWriteOpResult,
	DeleteWriteOpResultObject,
	Collection,
	InsertOneWriteOpResult
} from 'mongodb';
import { collectionConstructor } from './collection';
import * as Interfaces from './interfaces';

export class Connect {
	private url: string;
	private options: MongoClientOptions;

	private _database: Db;

	constructor({ url, options }: Interfaces.ConnectionParams) {
		this.url = url;
		this.options = options || {};

		this._connect();
	}

	private _connect() {
		return new Promise<Db>((resolve, reject) => {
			connect(this.url, this.options, (error, database) => {
				if (error) {
					reject(error);
				}
				this._database = database;
				resolve(database);
			});
		});
	}

	get collection() {
		return collectionConstructor(this);
	}

	public database() {
		return this._database ? new Promise<Db>((resolve) => resolve(this._database)) : this._connect();
	}
}
