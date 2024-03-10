const jwt = require('jsonwebtoken');
const { User } = require('../models');

const COOKIE = process.env.COOKIE;
const SECRET = process.env.login_SECRET;

const authenticateUser = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return res.status(401).json({ result: false, message: 'Missing authorization header' });
		}

		const [bearer, token] = req.headers.authorization.split(' ');

		if (bearer !== 'Bearer') {
			return res.status(401).json({ result: false, message: 'Missing authentication type' });
		}

		const userVerification = jwt.verify(token, SECRET);
		const { id, name, userid } = userVerification;

		const user = await User.findOne({
			where: {
				id,
				name,
				userid,
			},
		});

		if (!user) {
			return res.status(401).json({ result: false, message: 'User verification failed' });
		}

		req.user = user;
		return next();
	} catch (error) {
		console.error('Error during authentication:', error);
		return res.status(401).json({ result: false, message: 'Authentication failed' });
	}
};

module.exports = { authenticateUser };
