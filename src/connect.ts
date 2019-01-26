import {
	Db,
	MongoClientOptions,
	connect,
	InsertWriteOpResult,
	UpdateWriteOpResult,
	DeleteWriteOpResultObject,
	Collection,
	InsertOneWriteOpResult
} from "mongodb";

import { collectionConstructor } from "./collection";

import {
	FieldLevelQueryOperators,
	UpdateOperators,
	TopLevelQueryOperators,
	ConnectionParams
} from "./interfaces";

export class Connect {
	private url: string;
	private db: string;
	private options: MongoClientOptions;

	private _database: Db | undefined = undefined;

	constructor({ url, db, options }: ConnectionParams) {
		this.url = url;
		this.options = options || {};
		this.db = db;
		this._connect();
	}

	private _connect() {
		return new Promise<Db>((resolve, reject) => {
			connect(
				this.url,
				Object.assign(this.options, { useNewUrlParser: true }),
				(error, client) => {
					if (error) {
						reject(error);
					}
					this._database = client.db(this.db);
					resolve(this._database);
				}
			);
		});
	}

	get collection() {
		return collectionConstructor(this);
	}

	public database() {
		return this._database
			? new Promise<Db>(resolve => resolve(this._database))
			: this._connect();
	}
}
