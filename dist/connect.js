"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const collection_1 = require("./collection");
class Connect {
    constructor({ url, options }) {
        this.url = url;
        this.options = options || {};
        this._connect();
    }
    _connect() {
        return new Promise((resolve, reject) => {
            mongodb_1.connect(this.url, this.options, (error, database) => {
                if (error) {
                    reject(error);
                }
                this._database = database;
                resolve(database);
            });
        });
    }
    get collection() {
        return collection_1.collectionConstructor(this);
    }
    database() {
        return this._database ? new Promise((resolve) => resolve(this._database)) : this._connect();
    }
}
exports.Connect = Connect;
