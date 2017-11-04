import { Connect } from '../src';
import { randomBytes } from 'crypto';
const connection = new Connect({
	url: 'mongodb://localhost:27017/test',
	options: {
		native_parser: true
	}
});

interface Child {
	name: string;
	age: number;
}

interface Employee {
	_id: string;
	name: string;
	email: string;
	children: Child[];
	salary: number;
}

const employees = new connection.collection<Employee>('testing-employees');

test();

async function test() {
	await assert('Create One Document', async () => {
		const operation = await employees.createOne({
			document: randomDocument()
		});
		if (operation.result.n !== 1) {
			throw 'Operation did not give an error, but no documents created';
		}
	});

	await assert('Create Multiple Documents', async () => {
		const operation = await employees.createMany({
			documents: [
				randomDocument(),
				randomDocument(),
				randomDocument(),
				randomDocument(),
				randomDocument(),
				randomDocument(),
				randomDocument(),
				randomDocument(),
				randomDocument()
			]
		});
		if (operation.result.n !== 9) {
			throw `Operation did not give an error, but the result did not give 9 documents, instead it gave ${operation
				.result.n}`;
		}
	});

	await assert('Read all documents', async () => {
		const operation = await employees.read({});
		if (operation.length !== 10) throw `We were expecting 10 documents but we got: ${operation.length}`;
	});

	await assert('Read documents: with limit, skip & sort', async () => {
		const operationA = await employees.read({ limit: 5, skip: 0, sort: { key: 'name', direction: 1 } });
		const operationB = await employees.read({ limit: 5, skip: 5, sort: { key: 'name', direction: 1 } });

		const operationAIds = operationA.map((x) => x._id);
		const operationANames = operationA.map((x) => x.name);

		const operationBIds = operationB.map((x) => x._id);
		const operationBNames = operationB.map((x) => x.name);

		if ([ ...new Set(operationAIds.concat(operationBIds)) ].length !== 10) {
			throw 'Some intersection between A and B are found';
		}

		if (JSON.stringify(operationANames) !== JSON.stringify(operationANames.sort())) {
			throw 'Operation A is not sorted';
		}

		if (JSON.stringify(operationBNames) !== JSON.stringify(operationBNames.sort())) {
			throw 'Operation B is not sorted';
		}

		if (operationANames.length !== 5) {
			throw `Operation A is not limited to 5, it has ${operationANames.length}`;
		}

		if (operationBNames.length !== 5) {
			throw `Operation B is not limited to 5, it has ${operationBNames.length}`;
		}
	});

	await assert('Read documents: With numerical filter', async () => {
		const operation = await employees.read({
			filter: {
				salary: {
					$gt: 3500
				}
			}
		});

		const salariesLessThan3500 = operation.map((x) => x.salary).filter((x) => x < 3500);

		if (salariesLessThan3500.length !== 0) {
			throw `Filter was not applied, we had ${salariesLessThan3500.length} entries that we should not have had.`;
		}
	});

	await assert('Update documents: With numerical operator', async () => {
		const updateOperation = await employees.updateMany({
			filter: {
				salary: { $lt: 3500 }
			},
			update: {
				$mul: {
					salary: -1
				}
			}
		});
		const lessThanZero = await employees.read({ filter: { salary: { $lt: 0 } } });
		if (updateOperation.result.nModified !== lessThanZero.length) {
			throw 'Number of modified documents is not equal to number of documents that meets the filter';
		}
	});

	await assert('Replace document: Simple document replacement', async () => {
		const newDocument = randomDocument();
		newDocument.name = 'jack';
		delete newDocument._id;
		const replacementOperation = await employees.replaceOne({
			filter: { name: 'alex' },
			document: newDocument,
			upsert: false
		});

		const readOperation = await employees.read({ filter: { name: newDocument.name } });

		if (replacementOperation.result.nModified !== readOperation.length) {
			throw `Replacement operation result doesn't equal to read result length`;
		}
	});

	await assert('Replace document: With upsert', async () => {
		const newDocument = randomDocument();
		newDocument.name = 'alberto';
		const replacementOperation = await employees.replaceOne({
			filter: { name: 'ricardo' },
			document: newDocument,
			upsert: true
		});

		const readOperation = await employees.read({ filter: { name: newDocument.name } });

		if (replacementOperation.upsertedCount !== 1) {
			throw `Although we put upsert as an option, no document has been upserted ${JSON.stringify(
				replacementOperation.result
			)}`;
		}

		if (readOperation.length !== 1) {
			throw `Can not find the upserted document`;
		}
	});

	await assert('Replace document: Without upsert (no replacement should occur)', async () => {
		const newDocument = randomDocument();
		newDocument.name = 'William';
		const replacementOperation = await employees.replaceOne({
			filter: { name: 'ricardo' },
			document: newDocument,
			upsert: false
		});

		const readOperation = await employees.read({ filter: { name: newDocument.name } });

		if (replacementOperation.result.nModified !== 0) {
			throw `Although we put upsert to false, a document has been upserted`;
		}

		if (readOperation.length !== 0) {
			throw `We found a document that should not have been found`;
		}
	});

	await assert('Delete one document', async () => {
		const deleteOperation = await employees.deleteOne({ filter: { name: 'alberto' } });
		const readOperation = await employees.read({ filter: { name: 'alberto' } });

		if (deleteOperation.deletedCount !== 1) {
			throw 'Did not delete';
		}

		if (readOperation.length) {
			throw 'Found after deletion';
		}
	});

	await assert('Delete many documents', async () => {
		const deleteOperation = await employees.deleteMany({ filter: { salary: { $lt: 0 } } });
		const readOperation = await employees.read({ filter: { salary: { $lt: 0 } } });

		if (deleteOperation.result.n && deleteOperation.result.n < 2) {
			throw 'Did not delete';
		}

		if (readOperation.length) {
			throw 'Found after deletion';
		}
	});

	await assert('Count Documents', async () => {
		const count = await employees.count({});
		if (count < 1 || count > 9) {
			throw 'There is something not right about the count: ' + count;
		}
	});

	await assert('Read Distinct', async () => {
		const distinctNames = await employees.readDistinct<string>({ key: 'name' });
		const name = distinctNames[0];
		if (name) {
			const r = await employees.read({ filter: { name } });
			if (r.length !== 1) {
				throw 'The name was not really distinct: ' + r.length;
			}
		}
	});

	await assert('Create index', async () => {
		const operation = await employees.createIndex({
			key: 'email',
			unique: false,
			background: true,
			dropDups: true,
			sparse: true
		});
	});

	await assert('Drop Collection', async () => {
		const operation = await employees.drop({ name: 'testing-employees' });
		const read = await employees.read({});
		if (read.length !== 0) {
			throw `After dropping the collection the read should return an empty array but it's returning ${JSON.stringify(
				read
			)} instead`;
		}
	});

	process.exit(0);
}

async function assert(title: string, f: () => Promise<any>) {
	try {
		console.log('✍️ ', title);
		await f();
		console.log('\t', '👌 ', 'Success');
	} catch (e) {
		console.log('\t', '😱 ', 'Error:', e);
	}
}

function randomDocument(): Employee {
	function randomName() {
		const names = [
			'alex',
			'dylan',
			'adam',
			'liza',
			'rick',
			'carl',
			'jon',
			'bob',
			'glenn',
			'smith',
			'jane',
			'joe'
		];
		return names[Math.floor(Math.random() * names.length)];
	}

	function randomChild() {
		return {
			age: Math.floor(Math.random() * 19),
			name: randomName()
		};
	}

	const name = randomName();

	return {
		_id: randomBytes(18).toString('hex'),
		email: `${name}@gmail.com`,
		name,
		salary: Math.floor(Math.random() * 5000),
		children: [ randomChild(), randomChild(), randomChild() ]
	};
}
