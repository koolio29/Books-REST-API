const mongoose = require('mongoose');
const bycrypt = require('bcrypt');

// eslint-disable-next-line new-cap
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	created_at: {
		type: String,
		default: new Date(),
	},
});

UserSchema.methods.comparePassword = async (password, hashedPassword) => {
	try {
		return await bycrypt.compare(password, hashedPassword);
	} catch (err) {
		console.err(err.message);
		// If an error occured in the comparing we treat it as false password
		return false;
	}
};

module.exports = mongoose.model('User', UserSchema);
