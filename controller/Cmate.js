const bcrypt = require('bcrypt');
const { User, Room, UserRoom } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.login_SECRET;
const round = Number(process.env.hashRound);

const get_main = (req, res) => {
	res.render('mate');
};

const post_verify = async (req, res) => {
	try {
		console.log(req.headers);
		if (!req.headers.authorization) {
			return res.status(401).json({ result: false, message: 'Missing authorization header' });
		}

		const [bearer, token] = req.headers.authorization.split(' ');

		if (bearer !== 'Bearer') {
			return res.status(401).json({ result: false, message: 'Missing authentication type' });
		}

		jwt.verify(token, SECRET, async (err, data) => {
			if (err) {
				console.log('ERROR');
				return res.status(401).json({ result: false, message: 'Authentication failed' });
			}
			if (data) {
				const { id, name, userid } = data;

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
				console.log(user);
				return res.status(201).json({ result: true, message: 'User verification success', userinfo: user });
			}
		});
	} catch (error) {
		console.error('Error during authentication:', error);
		return res.status(401).json({ result: false, message: 'Authentication failed' });
	}
};

module.exports = {
	get_main,
	post_verify,
};

const bcryptPassword = (password) => bcrypt.hash(password, round);
const compareFunc = (password, dbpass) => bcrypt.compare(password, dbpass);
