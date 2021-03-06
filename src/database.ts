import { ConnectionParams } from "./interfaces";
import { connect, Db, MongoClientOptions } from "mongodb";

export class Database {
	private connectionStr: string;
	private dbName: string;
	private options: MongoClientOptions;

	private _database: Db | undefined = undefined;

	constructor({ url, db, options }: ConnectionParams) {
		this.connectionStr = url;
		this.options = options || {};
		this.dbName = db;
		this.database();
	}

	/**
	 * Perform database-level operations
	 */
	async database() {
		if (this._database) return this._database;
		const client = await connect(
			this.connectionStr,
			Object.assign(this.options, { useNewUrlParser: true })
		);
		this._database = client.db(this.dbName);
		return this._database;
	}
}
