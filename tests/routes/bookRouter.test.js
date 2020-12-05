const path = require('path');

// load up the .env variables for testing express server before importing them
process.env.DB_URI = null;
process.env.SAVE_PATH = path.resolve(__dirname, '../image');
process.env.JWT_KEY = 'Keyboardkitty';
process.env.PORT = null;
process.env.NODE_ENV = 'test';

// To make the current context happy running the config code
process.argv.push(path.join(__dirname, '.test.env'));

const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
const fs = require('fs');
const express = require('express');
const request = require('supertest');
const User = require('../../src/models/user');
const Book = require('../../src/models/book');
const bookRouter = require('../../src/routes/bookRouter');
const appSetup = require('../../src/setup/app-setup');
const userData = require('../data/user-data');
const bookData = require('../data/book-data');

// Instead of using the /user/login route, we are gonna get a JWT in setup
const jwt = require('jsonwebtoken');
let validJwt = null;

// Setting up express server for testing
const app = express();

// Mongoose Server instance
let server;

// book to update and delete
let bookToModify;

describe('Accessing Endpoint: /api/books', () => {
	beforeAll(async () => {
		server = new MongoMemoryServer();
		process.env.DB_URI = await server.getUri();

		mongoose.set('useUnifiedTopology', true);
		// eslint-disable-next-line max-len
		await mongoose.connect(process.env.DB_URI, {useNewUrlParser: true}, (err) => {
			if (err) {
				console.log(err);
			}
		});

		appSetup(app);
		app.use('/api/books', bookRouter);

		// create test folder to save
		fs.mkdirSync(process.env.SAVE_PATH);

		// Add a dummy user to work with
		await new User(userData[0]).save();

		for (let i = 0; i < bookData.length; i++) {
			await new Book(bookData[i]).save();
		}

		jwt.sign({username: 'Admin', password: 'This is some password'},
			process.env.JWT_KEY, {expiresIn: '1h'}, (err, token) => {
				validJwt = token;
			});
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await server.stop();

		fs.rmdirSync(process.env.SAVE_PATH, {recursive: true});
	});

	// eslint-disable-next-line max-len
	describe('Given that no JWT is passed in as authorization to access API', () => {
		test('Should reject request to get all books', (done) => {
			request(app)
				.get('/api/books')
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					expect(res.body).toEqual({message: 'JWT required'});
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Should reject request to get a single book', (done) => {
			request(app)
				.get('/api/books/somevalidid')
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					expect(res.body).toEqual({message: 'JWT required'});
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Should reject request to add a new book', (done) => {
			request(app)
				.post('/api/books')
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					expect(res.body).toEqual({message: 'JWT required'});
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Should reject request to update a books detail', (done) => {
			request(app)
				.put('/api/books/somevalidid')
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					expect(res.body).toEqual({message: 'JWT required'});
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Should reject attempt to delete a book', (done) => {
			request(app)
				.delete('/api/books/somevalidid')
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					expect(res.body).toEqual({message: 'JWT required'});
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	// eslint-disable-next-line max-len
	describe('Given that a valid JWT token is passed in as authorization to access API', () => {
		test('Can get all books from database', (done) => {
			request(app)
				.get('/api/books')
				.set('authorization', `JWT ${validJwt}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.then((res) => {
					expect(res.body.length).toBe(3);
					bookToModify = res.body[0];
					done();
				})
				.catch((err) => {
					console.log(err);
					done(err);
				});
		});

		test('Can get a single book from the database', (done) => {
			request(app)
				.get(`/api/books/${bookToModify._id}`)
				.set('authorization', `JWT ${validJwt}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.then((res) => {
					expect(res.body.length).toBe(1);
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Can add a single book to the database', (done) => {
			request(app)
				.post('/api/books')
				.set('authorization', `JWT ${validJwt}`)
				.send({
					title: 'Test Book',
					authors: ['Test Author'],
					publisher: 'Test 1',
					published: 'September 21, 1937',
					genre: ['fantasy', 'fiction'],
					summary: 'Test 1',
				})
				.expect('Content-Type', /json/)
				.expect(201)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Can add a new book with its cover image to the database', (done) => {
			request(app)
				.post('/api/books')
				.set('authorization', `JWT ${validJwt}`)
				.field({
					title: 'Test Book 22',
					authors: ['Test Author 22'],
					publisher: 'Test 22',
					published: 'September 21, 1937',
					genre: ['fantasy', 'fiction'],
					summary: 'Test 22',
				})
				.attach('cover_image', path.join(__dirname, '../data/image_1.png'))
				.expect('Content-Type', /json/)
				.expect(201)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Can update a books detail in database', (done) => {
			request(app)
				.put(`/api/books/${bookToModify._id}`)
				.set('authorization', `JWT ${validJwt}`)
				.send({
					title: 'Updated Book',
					authors: ['Updated Author 22'],
					publisher: 'Updated 22',
					published: 'September 21, 1937',
					genre: ['fantasy', 'fiction'],
					summary: 'Updated 22',
				})
				.expect('Content-Type', /json/)
				.expect(201)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Can update a book cover image stored in filesystem', (done) => {
			request(app)
				.put(`/api/books/${bookToModify._id}`)
				.set('authorization', `JWT ${validJwt}`)
				.attach('cover_image', path.join(__dirname, '../data/image_2.jpeg'))
				.expect('Content-Type', /json/)
				.expect(201)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Can delete a book and its cover image', (done) => {
			request(app)
				.delete(`/api/books/${bookToModify._id}`)
				.set('authorization', `JWT ${validJwt}`)
				.expect(204)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	// eslint-disable-next-line max-len
	describe('Given that a valid JWT token is passed in as authorization with an invalid book ID', () => {
		test('Should reject attempt to get a single book', (done) => {
			request(app)
				.put(`/api/books/invalid_id`)
				.set('authorization', `JWT ${validJwt}`)
				.expect('Content-Type', /json/)
				.expect(400)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Should reject attempt to update a books details', (done) => {
			request(app)
				.put(`/api/books/invalid_id`)
				.send({
					title: 'Updated Book',
					authors: ['Updated Author 22'],
					publisher: 'Updated 22',
					published: 'September 21, 1937',
					genre: ['fantasy', 'fiction'],
					summary: 'Updated 22',
				})
				.set('authorization', `JWT ${validJwt}`)
				.expect(400)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		test('Should reject attempt to delete a book and its details', (done) => {
			request(app)
				.put(`/api/books/invalid_id`)
				.set('authorization', `JWT ${validJwt}`)
				.expect(400)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});
});
