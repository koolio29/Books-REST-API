const userService = require('../../src/services/userService');

describe('UserService', () => {
	test('Module should be defined', () => {
		expect(userService).toBeDefined();
	});

	describe('Given a valid username and password', () => {
		test('Should register a new user', async () => {
			// eslint-disable-next-line require-jsdoc
			class MockUser {
				// eslint-disable-next-line require-jsdoc
				constructor(object) {
					this.username = object.username;
					this.password = object.password;
				}

				// eslint-disable-next-line require-jsdoc
				save() {
					return this;
				}

				// eslint-disable-next-line require-jsdoc
				exec() {
					return {username: 'admin', password: 'hashedpassword'};
				}
			}

			// eslint-disable-next-line require-jsdoc
			class MockBycrypt {
				// eslint-disable-next-line require-jsdoc
				static hash(passwordToHash, salt) {
					return 'hashedpassword';
				}
			}

			const UserService = userService(MockUser, MockBycrypt);

			const result = await UserService.registerUser('admin', 'password');
			expect(result).toEqual({username: 'admin', password: null});
		});

		test('Should login the user', async () => {
			// eslint-disable-next-line require-jsdoc
			class MockUser {
			// eslint-disable-next-line require-jsdoc
				constructor(object) {
					this.username = object.username;
					this.password = object.password;
				}

				// eslint-disable-next-line require-jsdoc
				static find(object) {
					return this;
				}

				// eslint-disable-next-line require-jsdoc
				static exec() {
					return [new MockUser({username: 'admin', password: 'password'})];
				}

				// eslint-disable-next-line require-jsdoc
				comparePassword(password, hashedPassword) {
					return true;
				}
			}

			const UserService = userService(MockUser);

			const result = await UserService.loginUser('admin', 'password');
			// eslint-disable-next-line max-len
			expect(result).toEqual(new MockUser({username: 'admin', password: 'password'}));
		});
	});

	describe('Given a invalid username', async () => {
		test('Should reject login attempt', async () => {
			// eslint-disable-next-line require-jsdoc
			class MockUser {
				// eslint-disable-next-line require-jsdoc
				constructor(object) {
					this.username = object.username;
					this.password = object.password;
				}

				// eslint-disable-next-line require-jsdoc
				static find(object) {
					return this;
				}

				// eslint-disable-next-line require-jsdoc
				static exec() {
					return [undefined];
				}

				// eslint-disable-next-line require-jsdoc
				comparePassword(password, hashedPassword) {
					return true;
				}
			}

			const UserService = userService(MockUser);
			const result = await UserService.loginUser('invalidUseer', 'randpass');

			expect(result).toEqual({err: 'Unauthorised. No user found!'});
		});
	});

	describe('Given a valid username but invalid password ', () => {
		test('Shoul reject login attempt', async () => {
			// eslint-disable-next-line require-jsdoc
			class MockUser {
				// eslint-disable-next-line require-jsdoc
				constructor(object) {
					this.username = object.username;
					this.password = object.password;
				}

				// eslint-disable-next-line require-jsdoc
				static find(object) {
					return this;
				}

				// eslint-disable-next-line require-jsdoc
				static exec() {
					return [new MockUser({username: 'admin', password: 'password'})];
				}

				// eslint-disable-next-line require-jsdoc
				comparePassword(password, hashedPassword) {
					return false;
				}
			}

			const UserService = userService(MockUser);
			const result = await UserService.loginUser('invalidUseer', 'password');

			expect(result).toEqual({err: 'Invalid password'});
		});
	});

	describe('Given that there is an error in database', () => {
		test('Should reject (returns error) register attempt', async () => {
			// eslint-disable-next-line require-jsdoc
			class MockUser {
				// eslint-disable-next-line require-jsdoc
				constructor(object) {
					this.username = object.username;
					this.password = object.password;
				}

				// eslint-disable-next-line require-jsdoc
				save() {
					throw new Error('Database Error');
				}

				// eslint-disable-next-line require-jsdoc
				comparePassword(password, hashedPassword) {
					return false;
				}
			}

			const UserService = userService(MockUser);
			const result = await UserService.registerUser('username', 'password');

			expect(result.err).toBeTruthy();
		});

		test('Should reject (returns error) login attempt', async () => {
			// eslint-disable-next-line require-jsdoc
			class MockUser {
				// eslint-disable-next-line require-jsdoc
				constructor(object) {
					this.username = object.username;
					this.password = object.password;
				}

				// eslint-disable-next-line require-jsdoc
				static find(object) {
					return this;
				}

				// eslint-disable-next-line require-jsdoc
				static exec() {
					throw new Error('Database Error');
				}

				// eslint-disable-next-line require-jsdoc
				comparePassword(password, hashedPassword) {
					return false;
				}
			}

			const UserService = userService(MockUser);
			const result = await UserService.loginUser('username', 'password');

			expect(result.err).toBeTruthy();
		});
	});
});
