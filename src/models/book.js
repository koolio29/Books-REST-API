const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const BookSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	authors: [{
		type: String,
		required: true,
	}],
	publisher: {
		type: String,
		required: true,
	},
	published: {
		type: String,
		required: true,
	},
	genre: [{
		type: String,
		required: true,
	}],
	summary: {
		type: String,
	},
	cover_image: {
		type: String,
	},
});

module.exports = mongoose.model('Book', BookSchema);
