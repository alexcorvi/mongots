import { Collection } from "../src";
import { Model } from "../src/model";
import { expect } from "chai";

interface Child {
	name: string;
	age: number;
}

class Employee extends Model {
	name: string = "alex";
	email: string = "alex@somemail.com";
	children: Child[] = [];
	salary: number = 0;
	numbers: number[] = [];
}

const employees = new Collection<Employee>({
	url: "mongodb://localhost:27017",
	db: "test",
	options: {
		native_parser: true,
		useUnifiedTopology: true,
	},
	collectionName: "testing-employees",
});

describe("Basic test", () => {
	before(async () => {
		await employees.insertMany({ documents: [Employee.new({})] });
		await employees.drop({ name: "testing-employees" });
	});

	it("Create one document", async () => {
		const operation = await employees.createOne({
			document: Employee.new({}),
		});
		expect(operation.result.n).eq(1);
	});
	it("Create multiple documents", async () => {
		const operation = await employees.createMany({
			documents: [
				Employee.new({
					name: "alex",
					email: "alex@gmail.com",
					salary: 1,
					children: [{ name: "al", age: 1 }],
				}),
				Employee.new({
					name: "john",
					email: "john@gmail.com",
					salary: 3,
					children: [{ name: "jo", age: 1 }],
				}),
				Employee.new({
					name: "dina",
					email: "dina@gmail.com",
					salary: 4,
					children: [{ name: "di", age: 1 }],
				}),
				Employee.new({
					name: "bill",
					email: "bill@gmail.com",
					salary: 9,
					children: [{ name: "bi", age: 1 }],
				}),
				Employee.new({
					name: "samy",
					email: "samy@gmail.com",
					salary: 2,
					children: [{ name: "sa", age: 1 }],
				}),
				Employee.new({
					name: "eddy",
					email: "eddy@gmail.com",
					salary: 6,
					children: [{ name: "ed", age: 1 }],
				}),
				Employee.new({
					name: "dann",
					email: "dann@gmail.com",
					salary: 7,
					children: [{ name: "da", age: 1 }],
				}),
				Employee.new({
					name: "eliz",
					email: "eliz@gmail.com",
					salary: 8,
					children: [{ name: "el", age: 1 }],
				}),
				Employee.new({
					name: "rich",
					email: "rich@gmail.com",
					salary: 5,
					children: [{ name: "ri", age: 1 }],
				}),
			],
		});
		expect(operation.result.n).eq(9);
	});
	it("Read all / length", async () => {
		expect((await employees.find({})).length).eq(10);
	});
	it("Read one / doc", async () => {
		const docs = await employees.find({ filter: { name: "samy" } });
		expect(docs.length).eq(1);
		expect(docs[0].salary).eq(2);
	});
	it("Limit, skip & sort", async () => {
		const operationA = await employees.read({
			limit: 5,
			skip: 0,
			sort: { key: "name", direction: 1 },
		});
		const operationB = await employees.read({
			limit: 5,
			skip: 5,
			sort: { key: "name", direction: 1 },
		});

		const operationAIds = operationA.map((x) => x._id);
		const operationANames = operationA.map((x) => x.name);

		const operationBIds = operationB.map((x) => x._id);
		const operationBNames = operationB.map((x) => x.name);

		expect(operationANames.length).eq(5);
		expect(operationBNames.length).eq(5);
		expect(JSON.stringify(operationANames)).eq(
			JSON.stringify(operationANames.sort())
		);
		expect(JSON.stringify(operationBNames)).eq(
			JSON.stringify(operationBNames.sort())
		);
		expect([...new Set(operationAIds.concat(operationBIds))].length).eq(10);
	});

	it("Replace document: Simple document replacement", async () => {
		const newDocument = Employee.new({ name: "jack" });
		const replacementOperation = await employees.replaceOne({
			filter: { name: "alex" },
			document: newDocument,
			upsert: false,
		});

		const readOperation = await employees.read({
			filter: { name: newDocument.name },
		});

		expect(replacementOperation.result.nModified).eq(readOperation.length);
	});

	it("Replace document: With upsert", async () => {
		const newDocument = Employee.new({ name: "alberto" });
		const replacementOperation = await employees.replaceOne({
			filter: { name: "ricardo" },
			document: newDocument,
			upsert: true,
		});
		const readOperation = await employees.read({
			filter: { name: newDocument.name },
		});
		expect(replacementOperation.upsertedCount).eq(1);
		expect(readOperation.length).eq(1);
	});

	it("Replace document: Without upsert (no replacement should occur)", async () => {
		const newDocument = Employee.new({ name: "william" });
		const replacementOperation = await employees.replaceOne({
			filter: { name: "ricardo" },
			document: newDocument,
			upsert: false,
		});

		const readOperation = await employees.read({
			filter: { name: newDocument.name },
		});

		expect(replacementOperation.result.nModified).eq(0);
		expect(readOperation.length).eq(0);
	});

	it("Delete one document", async () => {
		const deleteOperation = await employees.deleteOne({
			filter: { name: "alberto" },
		});
		const readOperation = await employees.read({
			filter: { name: "alberto" },
		});

		expect(deleteOperation.result.n).eq(1);
		expect(readOperation.length).eq(0);
	});

	it("Delete many documents", async () => {
		const deleteOperation = await employees.deleteMany({
			filter: { salary: { $lt: 5 } },
		});
		const readOperation = await employees.read({
			filter: { salary: { $lt: 5 } },
		});
		expect(deleteOperation.result.n).not.eq(0);
		expect(readOperation.length).eq(0);
	});

	it("Count Documents", async () => {
		await employees.insertMany({
			documents: [
				Employee.new({ salary: 99 }),
				Employee.new({ salary: 99 }),
				Employee.new({ salary: 99 }),
				Employee.new({ salary: 99 }),
				Employee.new({ salary: 99 }),
			],
		});
		const count = await employees.count({ filter: { salary: 99 } });
		expect(count).eq(5);
	});

	it("Read Distinct", async () => {
		const distinctNames = await employees.readDistinct({
			key: "name",
		});
		const name = distinctNames[0];
		if (name) {
			const r = await employees.read({ filter: { name } });
			expect(r.length).eq(1);
		}
	});

	it("Create index", async () => {
		const operation = await employees.createIndex({
			key: "email",
			unique: false,
			background: true,
			dropDups: true,
			sparse: true,
		});
		expect(typeof operation).eq("string");
	});

	it("Drop Collection", async () => {
		const operation = await employees.drop({ name: "testing-employees" });
		const read = await employees.read({});
		expect(read.length).eq(0);
	});
});
