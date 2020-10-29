"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongodb_1 = require("mongodb");
class Database {
    constructor({ url, db, options }) {
        this._database = undefined;
        this.connectionStr = url;
        this.options = options || {};
        this.dbName = db;
        this.database();
    }
    /**
     * Perform database-level operations
     */
    database() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._database)
                return this._database;
            const client = yield mongodb_1.connect(this.connectionStr, Object.assign(this.options, { useNewUrlParser: true }));
            this._database = client.db(this.dbName);
            return this._database;
        });
    }
}
exports.Database = Database;
