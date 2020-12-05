const path = require('path');

// The folder which the images would be saved is defaulted to the /public/images
// in the root of the project folder
const cwd = process.cwd();
const SAVE_PATH = process.env.SAVE_PATH || path.join(cwd, '/public/images');

const getBooks = (Model) => async () => {
	try {
		return await Model.find({}).exec();
	} catch (err) {
		console.error(err);
		return {err: err.message};
	}
};

const getBook = (Model) => async (bookID) => {
	try {
		return await Model.find({_id: bookID}).exec();
	} catch (err) {
		console.error(err);
		return {err: err.message};
	}
};

const addBook = (Model) => async (bookObj) => {
	let bookToAdd = new Model(bookObj);

	try {
		bookToAdd = await bookToAdd.save();
	} catch (err) {
		console.error(err);
		return {err: err.message};
	}

	return bookToAdd;
};

const updateBook = (Model, fileSystem) => async (bookID, bookObj) => {
	const fs = fileSystem.promises;
	let book = null;

	try {
		book = await Model.find({_id: bookID}).exec();
	} catch (err) {
		return {err: err.message};
	}

	if (!book) {
		return {err: 'Book to update not found'};
	}

	book = book[0]; // because .find() returns a list

	if (book.cover_image) {
		const coverName = book.cover_image.split('/').pop();
		const pathToFile = path.join(SAVE_PATH, coverName);

		try {
			await fs.unlink(pathToFile);
		} catch (err) {
			console.error(err); // very likely that the image is not found
		}
	}

	let updateResult = null;

	try {
		updateResult = await Model.update({_id: bookID}, bookObj).exec();
	} catch (err) {
		return {err: err.message};
	}

	if (updateResult.nModified == 1) {
		return bookObj;
	} else {
		return {err: 'No books were updated'};
	}
};

const deleteBook = (Model, fileSystem) => async (bookID) => {
	const fs = fileSystem.promises;
	let book = null;

	try {
		book = await Model.find({_id: bookID}).exec();
	} catch (err) {
		console.error(err);
		return {err: err.message};
	}

	if (!book) {
		return {err: 'Book to delete not found'};
	}

	book = book[0];

	if (book.cover_image) {
		const coverName = book.cover_image.split('/').pop();
		const pathToFile = path.join(SAVE_PATH, coverName);

		try {
			await fs.unlink(pathToFile);
		} catch (err) {
			console.error(err);
		}
	}

	let deleteResult = null;

	try {
		deleteResult = await Model.deleteOne({_id: bookID}).exec();
	} catch (err) {
		console.error(err);
		return {err: err.message};
	}

	if (deleteResult.deletedCount == 1) {
		return true;
	} else {
		return {err: 'No books were deleted'};
	}
};

module.exports = (BookModel, fileSystem = require('fs')) => {
	return {
		getBooks: getBooks(BookModel),
		getBook: getBook(BookModel),
		addBook: addBook(BookModel),
		updateBook: updateBook(BookModel, fileSystem),
		deleteBook: deleteBook(BookModel, fileSystem),
	};
};
