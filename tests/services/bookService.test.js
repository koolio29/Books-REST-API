const bookService = require('../../src/services/bookService');

describe('BookService', () => {
	test('Module should be defined', async () => {
		expect(bookService).toBeDefined();
	});

	test('Should get all the books from the database', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			// eslint-disable-next-line require-jsdoc
			static find() {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				return [{}, {}, {}];
			}
		}

		const BookService = bookService(MockModel);
		const result = await BookService.getBooks();

		expect(result.length).toBe(3);
	});

	// eslint-disable-next-line max-len
	test('Should give an error due to database error when getting all books', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			// eslint-disable-next-line require-jsdoc
			static find() {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				throw new Error('Database error');
			}
		}

		const BookService = bookService(MockModel);
		const result = await BookService.getBooks();

		expect(result.err).toBeTruthy();
	});

	test('Should get a single book for the given valid book ID', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				return [{}];
			}
		}

		const BookService = bookService(MockModel);
		const result = await BookService.getBook('somevalidid');

		expect(result.length).toBe(1);
	});

	// eslint-disable-next-line max-len
	test('Should get an error when getting a single book due to database error', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				throw new Error('Database error');
			}
		}

		const BookService = bookService(MockModel);
		const result = await BookService.getBook('somevalidid');

		expect(result.err).toBeTruthy();
	});

	// eslint-disable-next-line max-len
	test('Should add book to database using the given required fields', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			// eslint-disable-next-line require-jsdoc
			constructor(_obj) {}

			// eslint-disable-next-line require-jsdoc
			save(obj) {
				return {};
			}
		}

		const BookService = bookService(MockModel);
		const result = BookService.addBook({});

		expect(result.err).toBeFalsy();
	});

	// eslint-disable-next-line max-len
	test('Should give an error when adding the book due to database error', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			// eslint-disable-next-line require-jsdoc
			constructor(_obj) {}

			// eslint-disable-next-line require-jsdoc
			save(obj) {
				throw new Error('Database error');
			}
		}

		const BookService = bookService(MockModel);
		const result = await BookService.addBook({});

		expect(result.err).toBeTruthy();
	});

	// eslint-disable-next-line max-len
	test('Should update book using the given fields without a path to cover image', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			static execTime = 0;
			// eslint-disable-next-line require-jsdoc
			constructor() {}

			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				if (this.execTime == 0) {
					this.execTime++;
					return [{}];
				} else {
					return {nModified: 1};
				}
			}

			// eslint-disable-next-line require-jsdoc
			static update() {
				return this;
			}
		}

		// eslint-disable-next-line require-jsdoc
		const MockFilesystem = {
			promises: {
				unlink: (path2File) => {
					return true;
				},
			},
		};

		const BookService = bookService(MockModel, MockFilesystem);

		const result = await BookService.updateBook('validID', {_id: '2ew2ew2e'});
		expect(result.err).toBeFalsy();
	});

	// eslint-disable-next-line max-len
	test('Should update book using the given fields with a path to cover image', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			static execTime = 0;
			// eslint-disable-next-line require-jsdoc
			constructor() {}

			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				if (this.execTime == 0) {
					this.execTime++;
					return [{cover_image: 'images/file'}];
				} else {
					return {nModified: 1};
				}
			}

			// eslint-disable-next-line require-jsdoc
			static update() {
				return this;
			}
		}

		// eslint-disable-next-line require-jsdoc
		const MockFilesystem = {
			promises: {
				unlink: (path2File) => {
					return true;
				},
			},
		};

		const BookService = bookService(MockModel, MockFilesystem);

		const result = await BookService.updateBook('validID', {cover_image: ''});
		expect(result.err).toBeFalsy();
	});

	// eslint-disable-next-line max-len
	test('Should return an error when updating due to the book not existing', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			static execTime = 0;
			// eslint-disable-next-line require-jsdoc
			constructor() {}

			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				if (this.execTime == 0) {
					this.execTime++;
					return undefined;
				} else {
					return {nModified: 1};
				}
			}

			// eslint-disable-next-line require-jsdoc
			static update() {
				return this;
			}
		}

		// eslint-disable-next-line require-jsdoc
		const MockFilesystem = {
			promises: {
				unlink: (path2File) => {
					return true;
				},
			},
		};

		const BookService = bookService(MockModel, MockFilesystem);

		const result = await BookService.updateBook('validID', {_id: 'daweqd'});
		expect(result.err).toBeTruthy();
	});

	test('Should delete a book with the given valid ID', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			static execTime = 0;
			// eslint-disable-next-line require-jsdoc
			constructor() {}

			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static deleteOne() {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				if (this.execTime == 0) {
					this.execTime++;
					return [{}];
				} else {
					return {deletedCount: 1};
				}
			}

			// eslint-disable-next-line require-jsdoc
			static update() {
				return this;
			}
		}

		// eslint-disable-next-line require-jsdoc
		const MockFilesystem = {
			promises: {
				unlink: (path2File) => {
					return true;
				},
			},
		};

		const BookService = bookService(MockModel, MockFilesystem);

		const result = await BookService.deleteBook('validID', {_id: 'daweqd'});
		expect(result.err).toBeFalsy();
	});

	// eslint-disable-next-line max-len
	test('Should delete a book with the given valid ID with its cover image', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			static execTime = 0;
			// eslint-disable-next-line require-jsdoc
			constructor() {}

			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				if (this.execTime == 0) {
					this.execTime++;
					return [{cover_image: 'dada/dada'}];
				} else {
					return {deletedCount: 1};
				}
			}

			// eslint-disable-next-line require-jsdoc
			static deleteOne() {
				return this;
			}
		}

		// eslint-disable-next-line require-jsdoc
		const MockFilesystem = {
			promises: {
				unlink: (path2File) => {
					return true;
				},
			},
		};

		const BookService = bookService(MockModel, MockFilesystem);

		const result = await BookService.deleteBook('validID', {cover_image: ''});
		expect(result.err).toBeFalsy();
	});

	// eslint-disable-next-line max-len
	test('Should give an error when deleting a book due to it not being found', async () => {
		// eslint-disable-next-line require-jsdoc
		class MockModel {
			static execTime = 0;
			// eslint-disable-next-line require-jsdoc
			constructor() {}

			// eslint-disable-next-line require-jsdoc
			static find(obj) {
				return this;
			}

			// eslint-disable-next-line require-jsdoc
			static exec() {
				if (this.execTime == 0) {
					this.execTime++;
					return undefined;
				} else {
					return {deletedCount: 1};
				}
			}

			// eslint-disable-next-line require-jsdoc
			static deleteOne() {
				return this;
			}
		}

		// eslint-disable-next-line require-jsdoc
		const MockFilesystem = {
			promises: {
				unlink: (path2File) => {
					return true;
				},
			},
		};

		const BookService = bookService(MockModel, MockFilesystem);

		const result = await BookService.deleteBook('validID', {});
		expect(result.err).toBeTruthy();
	});
});
