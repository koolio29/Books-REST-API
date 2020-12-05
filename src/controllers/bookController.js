const multerSetup = require('../setup/multer');
const multer = require('multer');
const Book = require('../models/book');
const BookService = require('../services/bookService')(Book);
const appConfig = require('../config/config');

const SAVE_PATH = appConfig.saveDir;

const upload = multerSetup(SAVE_PATH);

const getBooks = async (req, res) => {
	const result = await BookService.getBooks();

	if (result.err) {
		res.status(500).set('Content-Type', 'application/json').json(result);
	}

	res.status(200).set('Content-Type', 'application/json').json(result);
};

const getBook = async (req, res) => {
	const result = await BookService.getBook(req.params.bookID);

	if (result.err) {
		res.status(500).set('Content-Type', 'application/json').json(result);
	}

	res.status(200).set('Content-Type', 'application/json').json(result);
};

const addBook = async (req, res) => {
	upload.single('cover_image')(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({message: err.message});
		}

		const bookToAdd = req.body;

		if (req.file) {
			bookToAdd.cover_image = `/${req.file.filename}`;
		}

		const result = await BookService.addBook(bookToAdd);

		if (result.err) {
			// eslint-disable-next-line max-len
			return res.status(400).set('Content-Type', 'application/json').json(result);
		}

		return res.status(201).set('Content-Type', 'application/json').json(result);
	});
};

const updateBook = (req, res) => {
	upload.single('cover_image')(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			return res.status(400).json({message: err.message});
		}

		const bookToUpdate = req.body;
		const bookID = req.params.bookID;

		if (req.file) {
			bookToUpdate.cover_image = `/${req.file.filename}`;
		}

		const result = await BookService.updateBook(bookID, bookToUpdate);

		if (result.err) {
			res
				.status(400)
				.set('Content-Type', 'application/json')
				.json(result);
			return;
		}

		return res.status(201).set('Content-Type', 'application/json').json(result);
	});
};

const deleteBook = async (req, res) => {
	const result = await BookService.deleteBook(req.params.bookID);

	if (result.err) {
		res.status(400).set('Content-Type', 'application/json').json(result);
	}

	res.status(204).end();
};

module.exports = {
	getBooks: getBooks,
	getBook: getBook,
	addBook: addBook,
	updateBook: updateBook,
	deleteBook: deleteBook,
};
