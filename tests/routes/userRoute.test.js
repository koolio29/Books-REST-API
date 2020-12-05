const path = require('path');

// load up the .env variables for testing express server before importing them
process.env.DB_URI = null;
process.env.SAVE_PATH = path.resolve(__dirname, '../images');
process.env.JWT_KEY = 'Keyboardkitty';
process.env.PORT = null;
process.env.NODE_ENV = 'test';

// To make the current context happy running the config code
process.argv.push(path.join(__dirname, '.test.env'));

const {MongoMemoryServer} = require('mongodb-memory-server');
const mongoose = require('mongoose');
// const fs = require('fs');
const express = require('express');
const request = require('supertest');
const userRoute = require('../../src/routes/userRouter');
const appSetup = require('../../src/setup/app-setup');

// Setting up express server for testing
const app = express();

// Mongoose Server instance
let server;

describe('Accessing Endpoint: /user', () => {
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
		app.use('/user', userRoute);
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await server.stop();
	});

	describe('User Registration', () => {
		test('Given username and password, user should be registered', (done) => {
			request(app)
				.post('/user/register')
				.send({
					username: 'admin',
					password: 'password',
				})
				.expect(201)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		// eslint-disable-next-line max-len
		test('Given a username but no password, registration should be rejected', (done) =>{
			request(app)
				.post('/user/register')
				.send({
					username: 'admin',
				})
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					expect(res.body.message).toMatch('Missing credentials');
					done();
				})
				.catch((err) => {
					done(err);
				});
		});

		// eslint-disable-next-line max-len
		test('Given a duplicate username, registration should be rejected', (done) => {
			request(app)
				.post('/user/register')
				.send({
					username: 'admin',
					password: 'password',
				})
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});

	describe('User Login', () => {
		test('Given a valid username and password, user must be logged in',
			(done) => {
				request(app)
					.post('/user/login')
					.send({
						username: 'admin',
						password: 'password',
					})
					.expect('Content-Type', /json/)
					.expect(200)
					.then((res) => {
						done();
					})
					.catch((err) => {
						done(err);
					});
			});

		test('Given a valid username but no password, login should be rejected',
			(done) => {
				request(app)
					.post('/user/login')
					.send({
						username: 'admin',
					})
					.expect('Content-Type', /json/)
					.expect(401)
					.then((res) => {
						expect(res.body.message).toMatch('Missing credentials');
						done();
					})
					.catch((err) => {
						done(err);
					});
			});

		test('Given a valid username but wrong password, login should be rejected',
			(done) => {
				request(app)
					.post('/user/login')
					.send({
						username: 'admin',
						password: 'wrongpassword',
					})
					.expect('Content-Type', /json/)
					.expect(401)
					.then((res) => {
						done();
					})
					.catch((err) => {
						done(err);
					});
			});

		test('Given an invalid username, login should be rejected', (done) => {
			request(app)
				.post('/user/login')
				.send({
					username: 'nousername',
					password: 'password',
				})
				.expect('Content-Type', /json/)
				.expect(401)
				.then((res) => {
					done();
				})
				.catch((err) => {
					done(err);
				});
		});
	});
});
