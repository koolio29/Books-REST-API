const express = require('express');
const BookController = require('../controllers/booksController');
const UserControlelr = require('../controllers/userController');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', UserControlelr.jwtRequired, BookController.getBooks);
router.get('/:bookID', UserControlelr.jwtRequired, BookController.getBook);
router.post('/', UserControlelr.jwtRequired, BookController.addBook);
router.put('/:bookID', UserControlelr.jwtRequired, BookController.updateBook);
// eslint-disable-next-line max-len
router.delete('/:bookID', UserControlelr.jwtRequired, BookController.deleteBook);

module.exports = router;
