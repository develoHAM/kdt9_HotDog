const multer = require('multer');
const multers3 = require('multer-s3-transform');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const path = require('path');
const sharp = require('sharp');

dotenv.config();
const env = process.env;

AWS.config.update({
	accessKeyId: env.accessKeyId,
	secretAccessKey: env.secretAccessKey,
	region: env.region,
});

const S3Storage = multers3({
	s3: new AWS.S3(),
	bucket: env.bucket,
	contentType: multers3.AUTO_CONTENT_TYPE,
	acl: 'public-read',
	shouldTransform: true,
	transforms: [
		{
			id: 'resized',
			key: function (req, file, cb) {
				const { userid } = req.body;
				const name = file.originalname;
				cb(null, `users/${userid}/${Date.now()}_${name}`);
			},
			transform: function (req, file, cb) {
				cb(null, sharp().resize(500, 500, { fit: 'inside' }));
			},
		},
	],
});

const upload = multer({ storage: S3Storage });

module.exports = upload.single('file');
