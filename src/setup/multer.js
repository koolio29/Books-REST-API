const multer = require('multer');

module.exports = (dst) => {
	const upload = multer({
		storage: multer.diskStorage({
			destination: (_req, _file, next) => {
				next(null, dst);
			},
			filename: (_req, file, next) => {
				const fileExtension = file.mimetype.split('/')[1];
				next(null, `${Date.now()}.${fileExtension}`);
			},
		}),
		limits: {
			fileSize: 10 * 1024 * 1024,
			files: 1,
		},
		fileFilter: (_req, file, next) => {
			if (file.mimetype.split('/')[0] == 'image') {
				next(null, true);
			} else {
				next({message: 'Not an image'}, false);
			}
		},
	});

	return upload;
};
