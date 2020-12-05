const express = require('express');
const mongoose = require('mongoose');
const appConfig = require('./config/config');
const appSetup = require('./setup/app-setup');
const bookRouter = require('./routes/bookRouter');
const userRouter = require('./routes/userRouter');

const app = express();

appSetup(app);

app.use('/api/books', bookRouter);
app.use('/user', userRouter);

const DB_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect(appConfig.databaseUrl, DB_OPTIONS, (err) => {
	if (err) {
		console.error(err.message);
		process.exit(1);
	}
	console.log('Connected to mongoose server');

	app.listen(appConfig.port, () => {
		console.log('> Server started on PORT: ', appConfig.port);
	});
});
