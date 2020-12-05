const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const appConfig = require('../config/config');


module.exports = (app) => {
	app.use(express.static(appConfig.saveDir));

	app.use(bodyParser.urlencoded({extended: true}));

	app.use(bodyParser.json());

	if (appConfig.env != 'test') {
		app.use(morgan('short'));
	}

	app.use((req, res, next) => {
		if (req.headers.authorization &&
			req.headers.authorization.split(' ')[0] == 'JWT') {
			const authToken = req.headers.authorization.split(' ')[1];

			jwt.verify(authToken, appConfig.jwtKey, (err, decoded) => {
				req.user = (err)? null : decoded;
				return next();
			});
		} else {
			req.user = null;
			return next();
		}
	});
};
