const User = require('../models/user.model');
const authUtil = require('../util/authenticated');

function getHome(req, res) {
	// res.send('<h1>Halaman Home</h1>');
}

function getSignup(req, res) {
	res.render('customer/auth/signup');
}

async function signup(req, res) {
	const user = new User(
		req.body.email,
		req.body.password,
		req.body.fullname,
		req.body.street,
		req.body.postal,
		req.body.city
	);
	await user.signup();

	res.redirect('/login');
}

function getLogin(req, res) {
	res.render('customer/auth/login');
}

async function login(req, res) {
	const user = new User(req.body.email, req.body.password);
	const existingUser = await user.getUserWithSameEmail();

	if (!existingUser) {
		res.redirect('/login');
		return;
	}

	const passwordIsCorrect = await user.hasMachingPassword(
		existingUser.password
	);

	if (!passwordIsCorrect) {
		res.redirect('/login');
		return;
	}

	authUtil.createUserSession(req, existingUser, function () {
		return res.redirect('/');
	});
	return;
}

module.exports = {
	getSignup: getSignup,
	getLogin: getLogin,
	getHome: getHome,
	signup: signup,
	login: login,
};
