const User = require('../models/user.model');
const authUtil = require('../util/authenticated');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
	let sessionData = sessionFlash.getSessionData(req);

	if (!sessionData) {
		sessionData = {
			email: '',
			confirmEmail: '',
			password: '',
			fullName: '',
			street: '',
			postal: '',
			city: '',
		};
	}
	res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
	const enteredData = {
		email: req.body.email,
		confirmEmail: req.body['confirm-email'],
		password: req.body.password,
		fullName: req.body.fullName,
		street: req.body.street,
		postal: req.body.postal,
		city: req.body.city,
	};
	console.log(
		!validation.userDetailsAreValid(
			req.body.email,
			req.body['confirm-email'],
			req.body.password,
			req.body.fullName,
			req.body.street,
			req.body.postal,
			req.body.city
		) && !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
	);
	if (
		!validation.userDetailsAreValid(
			req.body.email,
			req.body['confirm-email'],
			req.body.password,
			req.body.fullName,
			req.body.street,
			req.body.postal,
			req.body.city
		) &&
		!validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
	) {
		sessionFlash.flashDataToSession(
			req,
			{
				errorMessage:
					'please check your input. Password must be at leeast 6 characters long, postal code must be 5 characters long',
				...enteredData,
			},
			function () {
				res.redirect('/signup');
			}
		);
		return;
	}
	const user = new User(
		req.body.email,
		req.body.password,
		req.body.fullName,
		req.body.street,
		req.body.postal,
		req.body.city
	);

	try {
		const existingAlready = await user.existingAlready();

		if (existingAlready) {
			sessionFlash.flashDataToSession(
				req,
				{
					errorMessage: 'User exists alredy! try loggin in instead!',
					...enteredData,
				},
				function () {
					res.redirect('/signup');
				}
			);
			return;
		}
		await user.signup();
	} catch (error) {
		return next(error);
	}

	res.redirect('/login');
}

function getLogin(req, res) {
	let sessionData = sessionFlash.getSessionData(req);
	if (!sessionData) {
		sessionData = {
			email: '',
			password: '',
		};
	}
	res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
	const user = new User(req.body.email, req.body.password);
	let existingUser;

	try {
		existingUser = await user.getUserWithSameEmail();
	} catch (error) {
		return next(error);
	}

	const SessionErrorData = {
		errorMessage:
			'invalid credentials - please double-check your email dan password',
		email: user.email,
		password: user.password,
	};

	if (!existingUser) {
		sessionFlash.flashDataToSession(req, SessionErrorData, function () {
			res.redirect('/login');
		});
		return;
	}

	const passwordIsCorrect = await user.hasMachingPassword(
		existingUser.password
	);

	if (!passwordIsCorrect) {
		sessionFlash.flashDataToSession(req, SessionErrorData, function () {
			res.redirect('/login');
		});
		return;
	}

	authUtil.createUserSession(req, existingUser, function () {
		return res.redirect('/');
	});
	return;
}

function logout(req, res) {
	authUtil.destroyUserAuthSession(req);
	res.redirect('/login');
}

module.exports = {
	getSignup: getSignup,
	getLogin: getLogin,
	signup: signup,
	login: login,
	logout: logout,
};
