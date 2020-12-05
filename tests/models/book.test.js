const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Book = require('../../src/models/book');

describe('Book Model', () => {
	beforeAll(async () => {
		server = new MongoMemoryServer();
		process.env.DB_URI = await server.getUri();

		await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}, (err) => {
			if (err) {
				console.log(err);
			}
		});
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await server.stop();
	});

	test('Module should be defined', async () => {
		expect(Book).toBeDefined();
	});
});
