const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserService = require('../services/userService')(User);
const appConfig = require('../config/config');

const registerUser = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(401).json({message: 'Missing credentials'});
	}

	const result = await UserService.registerUser(username, password);

	if (result.err) {
		return res.status(401).json(result);
	}

	return res.status(201).json(result);
};

const loginUser = async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(401).json({message: 'Missing credentials'});
	}

	const loginAttempt = await UserService.loginUser(username, password);

	if (loginAttempt.err) {
		return res.status(401).json(loginAttempt);
	}

	const toTokenise = {
		username: loginAttempt.username,
		password: loginAttempt.password,
	};

	jwt.sign(toTokenise, appConfig.jwtKey, {expiresIn: '1h'}, (err, token) => {
		if (err) {
			return res.status(401).json({message: 'Unable to authorise user'});
		}

		return res.status(200).json({token: token});
	});
};

const jwtRequired = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		return res.status(401).json({message: 'JWT required'});
	}
};

module.exports = {
	registerUser: registerUser,
	loginUser: loginUser,
	jwtRequired: jwtRequired,
};
