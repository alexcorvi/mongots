"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function collectionConstructor(db) {
    return class CollectionC {
        constructor(collection) {
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
            this._collectionName = collection;
        }
        _collection() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield db.database()).collection(this._collectionName);
            });
        }
        /**
         * Put one document
         */
        createOne({ document }) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._collection()).insertOne(document);
            });
        }
        /**
         * Put multiple documents
         */
        createMany({ documents }) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._collection()).insertMany(documents);
            });
        }
        /**
         * Find documents that meets a specified criteria
         */
        read({ filter, skip, limit, sort = undefined }) {
            return __awaiter(this, void 0, void 0, function* () {
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
        updateMany({ filter, update }) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._collection()).updateMany(filter, update);
            });
        }
        /**
         * Update one document that meets the specified criteria
         */
        updateOne({ filter, update }) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._collection()).updateOne(filter, update);
            });
        }
        /**
         * Replaces one document that meets the specified criteria
         */
        replaceOne({ filter, document, upsert }) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._collection()).updateOne(filter, document, { upsert });
            });
        }
        /**
         * Delete many documents that meets the specified criteria
         *
         */
        deleteMany({ filter }) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._collection()).deleteMany(filter);
            });
        }
        /**
         * Delete one document that meets the specified criteria
         */
        deleteOne({ filter }) {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this._collection()).deleteOne(filter);
            });
        }
        /**
         * Count documents that meets the specified criteria
         */
        count({ filter, limit }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (yield this._collection()).count(filter || {}, { limit });
            });
        }
        /**
         * Returns a list of distinct values for the given key across a collection.
         */
        readDistinct({ key, filter }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (yield this._collection()).distinct(key, filter || {});
            });
        }
        /**
         * Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
         */
        drop({ name }) {
            return __awaiter(this, void 0, void 0, function* () {
                return name === this._collectionName ? yield (yield this._collection()).drop() : undefined;
            });
        }
        /**
         * Creates an index on the db and collection.
         */
        createIndex({ key, unique, sparse, background, dropDups }) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (yield this._collection()).createIndex(key, { unique, sparse, background, dropDups });
            });
        }
        /**
         * Renames the collection
         */
        rename({ newName, dropTarget }) {
            return __awaiter(this, void 0, void 0, function* () {
                const r = yield (yield this._collection()).rename(newName, { dropTarget });
                this._collectionName = newName;
                return;
            });
        }
    };
}
exports.collectionConstructor = collectionConstructor;
