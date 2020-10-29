"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Model = exports.MongoDB = exports.Collection = void 0;
const database_1 = require("./database");
const model_1 = require("./model");
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return model_1.Model; } });
const MongoDB = __importStar(require("mongodb"));
exports.MongoDB = MongoDB;
class Collection extends database_1.Database {
    constructor(params) {
        super(params);
        /**
         * Aliases
         *
         */
        this.find = this.read;
        this.insert = this.createOne;
        this.insertOne = this.createOne;
        this.insertMany = this.createMany;
        this.distinct = this.readDistinct;
        this.removeOne = this.deleteOne;
        this.removeMany = this.deleteMany;
        this._collectionName = params.collectionName;
    }
    _collection() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.database()).collection(this._collectionName);
        });
    }
    /**
     * Put one document
     */
    createOne({ document, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this._collection()).insertOne(document);
        });
    }
    /**
     * Put multiple documents
     */
    createMany({ documents, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this._collection()).insertMany(documents);
        });
    }
    /**
     * Find one document
     */
    findOne({ filter, skip, limit, sort = undefined, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            return (yield this._collection()).findOne(filter);
        });
    }
    /**
     * Find documents that meets a specified criteria
     */
    read({ filter, skip, limit, sort = undefined, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            const cursor = (yield this._collection()).find(filter);
            if (sort) {
                const sortObj = {};
                sortObj[sort.key] = sort.direction;
                cursor.sort(sortObj);
            }
            if (skip) {
                cursor.skip(skip);
            }
            if (limit) {
                cursor.limit(limit);
            }
            return yield cursor.toArray();
        });
    }
    /**
     * Update many documents that meets the specified criteria
     */
    updateMany({ filter, update, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            if (update.$set) {
                update.$set = fixDeep(update.$set);
            }
            if (update.$unset) {
                update.$unset = fixDeep(update.$unset);
            }
            update = fix$Pull$eq(update);
            return yield (yield this._collection()).updateMany(filter, update);
        });
    }
    /**
     * Update one document that meets the specified criteria
     */
    updateOne({ filter, update, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            update = fix$Pull$eq(update);
            if (update.$set) {
                update.$set = fixDeep(update.$set);
            }
            if (update.$unset) {
                update.$unset = fixDeep(update.$unset);
            }
            return yield (yield this._collection()).updateOne(filter, update);
        });
    }
    /**
     * Replaces one document that meets the specified criteria
     */
    replaceOne({ filter, document, upsert, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            let replaceDoc = document;
            delete replaceDoc._id; // must be any type to be able to delete _id
            return yield (yield this._collection()).replaceOne(filter, replaceDoc, {
                upsert,
            });
        });
    }
    /**
     * Update document(s) that meets the specified criteria,
     * and do an insertion if no documents are matched
     */
    upsert({ filter, update, multi, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            if (update.$set) {
                update.$set = fixDeep(update.$set);
            }
            if (update.$unset) {
                update.$unset = fixDeep(update.$unset);
            }
            const updateOperators = Object.keys(update);
            for (let index = 0; index < updateOperators.length; index++) {
                const updateOperator = updateOperators[index];
                if (updateOperator === "$setOnInsert")
                    continue;
                const fields = Object.keys(update[updateOperator]);
                for (let j = 0; j < fields.length; j++) {
                    const field = fields[j];
                    delete update.$setOnInsert[field];
                }
            }
            if (multi) {
                return yield (yield this._collection()).updateMany(filter, update, {
                    upsert: true,
                });
            }
            else {
                return yield (yield this._collection()).updateOne(filter, update, {
                    upsert: true,
                });
            }
        });
    }
    /**
     * Delete many documents that meets the specified criteria
     *
     */
    deleteMany({ filter, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            return yield (yield this._collection()).deleteMany(filter);
        });
    }
    /**
     * Delete one document that meets the specified criteria
     */
    deleteOne({ filter, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            return yield (yield this._collection()).deleteOne(filter);
        });
    }
    /**
     * Count documents that meets the specified criteria
     */
    count({ filter, limit, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            return yield (yield this._collection()).countDocuments(filter || {}, {
                limit,
            });
        });
    }
    /**
     * Returns a list of distinct values for the given key across a collection.
     */
    readDistinct({ key, filter, }) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = fixDeep(filter || {});
            return yield (yield this._collection()).distinct(key.toString(), filter || {});
        });
    }
    /**
     * Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
     */
    drop({ name }) {
        return __awaiter(this, void 0, void 0, function* () {
            return name === this._collectionName
                ? yield (yield this._collection()).drop()
                : undefined;
        });
    }
    /**
     * Creates an index on the db and collection.
     */
    createIndex({ key, unique, sparse, background, dropDups, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this._collection()).createIndex(key, {
                unique,
                sparse,
                background,
                dropDups,
            });
        });
    }
    /**
     * Removes an index on the db and collection.
     */
    removeIndex({ key, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this._collection()).dropIndex(key);
        });
    }
    /**
     * Renames the collection
     */
    rename({ newName, dropTarget, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield (yield this._collection()).rename(newName, {
                dropTarget,
            });
            this._collectionName = newName;
            return;
        });
    }
}
exports.Collection = Collection;
function fixDeep(input) {
    const result = Object.assign(input, input.$deep);
    delete result.$deep;
    return result;
}
function fix$Pull$eq(updateQuery) {
    if (updateQuery.$pull) {
        Object.keys(updateQuery.$pull).forEach((key) => {
            if (updateQuery.$pull[key].$eq) {
                updateQuery.$pull[key] = updateQuery.$pull[key].$eq;
            }
        });
    }
    return updateQuery;
}
