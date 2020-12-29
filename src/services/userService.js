const registerUser = (Model, bcrypt) => async (username, password) => {
	let userToRegister = new Model({username: username, password: password});

	try {
		userToRegister.password = await bcrypt.hash(userToRegister.password, 10);
		userToRegister = await userToRegister.save();
	} catch (err) {
		console.error(err);
		if (err.message.includes('E11000')) {
			return {err: 'Duplicate username'};
		} else {
			return {err: err.message};
		}
	}

	userToRegister.password = null;

	return userToRegister;
};

const loginUser = (Model) => async (username, password) => {
	let user = null;

	try {
		user = await Model.find({username: username}).exec();
	} catch (err) {
		console.error(err.message);
		return {err: err.message};
	}

	if (user == false) {
		return {err: 'Unauthorised. No user found!'};
	}

	user = user[0];

	try {
		const result = await user.comparePassword(password, user.password);
		return (result) ? user : {err: 'Invalid password'};
	} catch (err) {
		console.log(err.message);
		return {err: err.message};
	}
};

module.exports = (UserModel, bcrypt = require('bcrypt')) => {
	return {
		registerUser: registerUser(UserModel, bcrypt),
		loginUser: loginUser(UserModel),
	};
};
