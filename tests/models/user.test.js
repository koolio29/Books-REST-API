const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../../src/models/user');

let server;

// Setting up environment process.env.PORT
process.env.DB_URI = null;
process.env.SAVE_PATH = null;
process.env.JWT_KEY = null;
process.env.PORT = null;
process.env.NODE_ENV = 'test';

describe('User Model', () => {
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

	test('Module should be defined', () => {
		expect(User).toBeDefined();
	});

	test('Should return \'true\' given the correct password', async () => {
		const plain = 'This is some password';
		// eslint-disable-next-line max-len
		const cipher = '$2b$10$Kv/0EIZDw8q/WwhVVy6gxuZ/qJhNKxS5GRPl2aH3G/Uz.a4pBqWLa';

		const userToValidate = new User({
			username: 'someuser',
			password: cipher,
			created_at: new Date(),
		});

		expect(await userToValidate.comparePassword(plain, cipher)).toBe(true);
	});

	test('Should return \'false\' given incorrect', async () => {
		const plain = 'This is the wrong password';
		// eslint-disable-next-line max-len
		const cipher = '$2b$10$Kv/0EIZDw8q/WwhVVy6gxuZ/qJhNKxS5GRPl2aH3G/Uz.a4pBqWLa';

		const userToValidate = new User({
			username: 'someuser',
			password: cipher,
			created_at: new Date(),
		});

		expect(await userToValidate.comparePassword(plain, cipher)).toBe(false);
	});
});
