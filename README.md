# Mongots:

![](https://i.imgur.com/XWz8xDH.png)

## What is this

An abstraction layer aimed for better API design and stronger type declarations for better experience with TypeScript and MongoDB.

There **is** a types declaration file for MongoDB on the DefinitelyTyped repository, however the types declaration file doesn't support typing for the dollar sign operators (like: `$gt` and `$set`), which is basically where you need strong type declarations, and that is basically a side-effect of the query API design. This is why slight changes to the query API has been introduced here.

This library can cover 90% of the use cases, with a more clean and robust API design and type declaration where ever possible (everywhere except in embedded documents).

## What this is not

-   This is not a replacement for MongoDB driver like I said, it can cover up to 90% of the use cases, but definitely not 100%.
-   This is not a replacement for Mongoose, if you're looking for a full-fledged ODM, then you better go with Mongoose.
-   This is nothing more than an abstraction layer, aimed for a better API design and sweet type declarations.

## Getting Started

### Installation

```
npm i mongots --save
```

or

```
yarn add mongots
```

### Usage

```typescript
import { Connect, Model } from "mongots";

const connection = new Connect({
    // connect to your server through the URL:
    url: "mongodb://localhost:27017",
    // pick your database
    db: "myDatabaseName",
    // you can also have the same connection option
    // you usually have with the native MongoDB driver
    options: {
        native_parser: true,
        // ... etc
    }
});

// Next you specify a collection to work on
// but before that, let's define
// a TypeScript interface for your collection schema

class Employee extends Model {
    name: string = ""; // define defaults
    email: string = "";
    salary: number = 0;
    phoneNumbers: number[] = [];
}

const employees = connection.collection<Employee>('employees');

// now you can apply read/write operations on the collection

await employees.createOne({
    document: {
        name: "Alex";
        email: "alex@g.com";
        salary: 0;
        phoneNumbers: [07303423653322, 07303428365333, 07303423653319];
    }
});

```

Here's a list of all the methods that are available on every collection:

#### `collection('name').createOne`

-   Description: Puts one document
-   Params:

```typescript
{
	document: Schema;
}
```

-   Returns:

```typescript
Promise<{
    insertedCount: number;
    ops: Array<any>;
    insertedIds: Array<ObjectID>;
    connection: any;
    result: { ok: number, n: number }
}>
```

#### `collection('name').createMany`

-   Description: Puts multiple documents
-   Params:

```typescript
{
    documents: Array<Schema>
}
```

-   Returns: Puts multiple documents

```typescript
Promise<{
    result: { ok: number, n: number, nModified: number };
    connection: any;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: { _id: ObjectID };
}>
```

#### `collection('name').read`

-   Description: Finds documents that meets a specified criteria
-   Params:

```typescript
{
    filter?: Filter<Schema>;
    skip?: number;
    limit?: number;
    sort?: { key: string; direction: number };
}
```

-   Returns:

```typescript
Promise<Array<Schema>>
```

#### `collection('name').updateMany`

-   Description: Updates many documents that meets the specified criteria
-   Params:

```typescript
{
    filter: Filter<Schema>;
    update: {
        $inc?: Schema;
        $mul?: Schema;
        $rename?: Schema;
        $setOnInsert?: Schema;
        $set?: Schema;
        $unset?: Schema;
        $min?: Schema;
        $max?: Schema;
        $currentDate?: Schema;
        $addToSet?: Schema | {
            $each: any[];
            $slice: number;
            $sort: Schema | {};
            $position: number;
        };
        $pop?: Schema;
        $pullAll?: Schema;
        $pull?: Schema;
        $push?: Schema | {
            $each: any[];
            $slice: number;
            $sort: Schema | {};
            $position: number;
        }
    }
}
```

-   Returns:

```typescript
Promise<{
    result: { ok: number, n: number, nModified: number };
    connection: any;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: { _id: ObjectID };
}>
```

#### `collection('name').updateOne`

-   Description: Updates one document that meets the specified criteria
-   Params:

```typescript
// same as collection('name').updateMany
```

-   Returns:

```typescript
// same as collection('name').updateMany
```

#### `collection('name').replaceOne`

-   Description: Replaces one document that meets the specified criteria
-   Params:

```typescript
{
    filter: Filter<Schema>;
    document: Schema;
    upsert?: boolean;
}
```

-   Returns:

```typescript
// same as collection('name').updateMany
```

#### `collection('name').deleteMany`

-   Description: Deletes many documents that meets the specified criteria
-   Params:

```typescript
{
    filter: Filter<Schema>;
}
```

-   Returns:

```typescript
Promise<{
    result: {
        ok?: number;
        n?: number;
    }
    deletedCount?: number;
}>
```

#### `collection('name').deleteOne`

-   Description: Deletes one document that meets the specified criteria
-   Params:

```typescript
// same as collection('name').deleteMany
```

-   Returns:

```typescript
// same as collection('name').deleteMany
```

#### `collection('name').readDistinct`

-   Description: Returns a list of distinct values for the given key across a collection.
-   Params:

```typescript
{
    key: keyof Schema;
    filter?: Filter<Schema>;
}
```

-   Returns:

```typescript
Promise<valueType[]>
```

#### `collection('name').drop`

-   Description: Drops the collection totally, must pass the collection name, just to make sure you know what you're doing
-   Params:

```typescript
{
	name: string;
}
```

-   Returns:

```typescript
Promise<void>
```

#### `collection('name').createIndex`

-   Description: Creates an index on the db and collection.
-   Params:

```typescript
{
    key: keys<Schema> | keys<Schema>[];
    unique?: boolean;
    sparse?: boolean;
    background?: boolean;
    dropDups?: boolean;
}
```

-   Returns:

```typescript
Promise<string>
```

#### `collection('name').rename`

-   Description: Renames the collection
-   Params:

```typescript
{
	newName: string;
	dropTarget: boolean;
}
```

-   Returns:

```typescript
Promise<void>
```

#### `collection('name').find`

alias of `collection('name').read`

#### `collection('name').insert`

alias of `collection('name').createOne`

#### `collection('name').insertOne`

alias of `collection('name').createOne`

#### `collection('name').insertMany`

alias of `collection('name').createMany`

#### `collection('name').distinct`

alias of `collection('name').readDistinct`

#### `collection('name').removeOne`

alias of `collection('name').deleteOne`

#### `collection('name').removeMany`

alias of `collection('name').deleteMany`
