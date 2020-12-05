const dotenv = require('dotenv');
const path = require('path');

let path2Env = null;

try {
	path2Env = path.resolve(process.argv[2]);
} catch (err) {
	console.error(err.message);
}

(path2Env)? dotenv.config({path: path2Env}) : dotenv.config();

module.exports = {
	port: process.env.PORT,
	databaseUrl: process.env.DB_URI,
	saveDir: path.resolve(process.env.SAVE_PATH),
	jwtKey: process.env.JWT_KEY,
	env: process.env.NODE_ENV,
};
