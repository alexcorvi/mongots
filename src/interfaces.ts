import {
	InsertWriteOpResult,
	UpdateWriteOpResult,
	DeleteWriteOpResultObject,
	Collection,
	InsertOneWriteOpResult,
	MongoClientOptions
} from 'mongodb';

export interface ConnectionParams {
	url: string;
	options?: MongoClientOptions;
}

export interface UpdateOperatorsModifiers<Schema> {
	/**
	 * Modifies the $push and $addToSet operators to append multiple items for array updates.
	*/
	$each: any[];
	/**
	 * Modifies the $push operator to limit the size of updated arrays.
	*/
	$slice: number;
	/**
	 * Modifies the $push operator to reorder documents stored in an array.
	*/
	$sort: Schema | {};
	/**
	 * Modifies the $push operator to specify the position in the array to add elements.
	*/
	$position: number;
}

export interface UpdateOperators<Schema> {
	/**
	 * Increments the value of the field by the specified amount.
	*/
	$inc?: Schema | {};
	/**
	 * Multiplies the value of the field by the specified amount.
	*/
	$mul?: Schema | {};
	/**
	 * Renames a field.
	*/
	$rename?: Schema | {};
	/**
	 * Sets the value of a field if an update results in an insert of a document. Has no effect on update operations that modify existing documents.
	*/
	$setOnInsert?: Schema | {};
	/**
	 * Sets the value of a field in a document.
	*/
	$set?: Schema | {};
	/**
	 * Removes the specified field from a document.
	*/
	$unset?: Schema | {};
	/**
	 * Only updates the field if the specified value is less than the existing field value.
	*/
	$min?: Schema | {};
	/**
	 * Only updates the field if the specified value is greater than the existing field value.
	*/
	$max?: Schema | {};
	/**
	 * Sets the value of a field to current date, either as a Date or a Timestamp.
	*/
	$currentDate?: Schema | {};
	/**
	 * Adds elements to an array only if they do not already exist in the set.
	*/
	$addToSet?: Schema | UpdateOperatorsModifiers<Schema> | {};
	/**
	 * Removes the first or last item of an array.
	*/
	$pop?: Schema | {};
	/**
	 * Removes all matching values from an array.
	*/
	$pullAll?: Schema | {};
	/**
	 * Removes all array elements that match a specified query.
	*/
	$pull?: Schema | {};
	/**
	 * Adds an item to an array.
	*/
	$push?: Schema | UpdateOperatorsModifiers<Schema> | {};
}

export interface FieldLevelOperators {
	/**
	 * Specifies equality condition. The $eq operator matches documents where the value of a field equals the specified value.
	 * {field: { $eq: <value> }}
	 */
	$eq?: any;

	/**
	 * $gt selects those documents where the value of the field is greater than (i.e. >) the specified value.
	 * {field: {$gt:value}}
	 */
	$gt?: number;

	/**
	 * $gte selects the documents where the value of the field is greater than or equal to (i.e. >=) a specified value 
	 * {field: {$gte:value}}
	 */
	$gte?: number;

	/**
	 * The $in operator selects the documents where the value of a field equals any value in the specified array.
	 * { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
	 */
	$in?: any[];

	/**
	 * $lt selects the documents where the value of the field is less than (i.e. <) the specified value.
	 * {field: {$lt:value}}
	 */
	$lt?: number;

	/**
	 * $lte selects the documents where the value of the field is less than or equal to (i.e. <=) the specified value.
	 * {field: {$lte:value}}
	 */
	$lte?: number;

	/**
	 * $ne selects the documents where the value of the field is not equal (i.e. !=) to the specified value. This includes documents that do not contain the field.
	 * {field: {$ne:value}}
	 */
	$ne?: any;

	/**
	 * $nin selects the documents where: the field value is not in the specified array or the field does not exist.
	 * { field: { $nin: [ <value1>, <value2> ... <valueN> ]} }
	 */
	$nin?: any[];

	/**
	 * $not performs a logical NOT operation on the specified <operator-expression> and selects the documents that do not match the <operator-expression>. This includes documents that do not contain the field.
	 * { field: { $not: { <operator-expression> } } }
	 */
	$not?: FieldLevelOperators;

	/**
	 * When <boolean> is true, $exists matches the documents that contain the field, including documents where the field value is null. If <boolean> is false, the query returns only the documents that do not contain the field.
	 * { field: { $exists: <boolean> } }
	 */
	$exist?: boolean;

	/**
	 * Select documents where the value of a field divided by a divisor has the specified remainder (i.e. perform a modulo operation to select documents). To specify a $mod expression, use the following syntax:
	 * { field: { $mod: [ divisor, remainder ] } }
	 */
	$mod?: [number, number];

	/**
	 * Provides regular expression capabilities for pattern matching strings in queries. MongoDB uses Perl compatible regular expressions (i.e. “PCRE” ) version 8.41 with UTF-8 support.
	 * {field:{$regex: /pattern/<options>}}
	 */
	$regex?: RegExp;

	/**
	 * The $all operator selects the documents where the value of a field is an array that contains all the specified elements.
	 *{ field: { $all: [ <value1> , <value2> ... ] } }
	 */
	$all?: any[];

	/**
	 * The $elemMatch operator matches documents that contain an array field with at least one element that matches all the specified query criteria.
	 * { <field>: { $elemMatch: { <query1>, <query2>, ... } } }
	 */
	$elemMatch: FieldLevelOperators;

	/**
	 * The $size operator matches any array with the number of elements specified by the argument. For example:{ field: { $size: 2 } }
	 */
	$size: number;
}

export interface TopLevelOperators<Schema> {
	/**
	 * $and performs a logical AND operation on an array of two or more expressions (e.g. <expression1>, <expression2>, etc.) and selects the documents that satisfy all the expressions in the array. The $and operator uses short-circuit evaluation. If the first expression (e.g. <expression1>) evaluates to false, MongoDB will not evaluate the remaining expressions.
	 * { $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }
	 */
	$and?: Filter<Schema>[];

	/**
	 * $nor performs a logical NOR operation on an array of one or more query expression and selects the documents that fail all the query expressions in the array. The $nor has the following syntax:
	 * { $nor: [ { <expression1> }, { <expression2> }, ...  { <expressionN> } ] }
	 */
	$nor?: Filter<Schema>[];

	/**
	 * The $or operator performs a logical OR operation on an array of two or more <expressions> and selects the documents that satisfy at least one of the <expressions>. The $or has the following syntax:
	 * { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
	 */
	$or?: Filter<Schema>[];

	/**
	 * Use the $where operator to pass either a string containing a JavaScript function to the query system. The $where provides greater flexibility, but requires that the database processes the JavaScript expression or function for each document in the collection. Reference the document in the JavaScript expression or function using this.
	*/
	$where?: (this: Schema) => boolean;
}

export type keys<Schema> = keyof Schema;
export type Filter<Schema> = { [key in keys<Schema>]: FieldLevelOperators } | TopLevelOperators<Schema> | {};
