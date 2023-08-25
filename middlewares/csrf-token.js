const csrf = require('csrf');

const tokens = new csrf({ saltLength: 10, secretLength: 20 });

function addCSRFToken(req, res, next) {
	let secret = tokens.secretSync();
	let token = tokens.create(secret);

	// console.log(token);
	res.locals.csrfToken = token;

	next();
}

module.exports = addCSRFToken;
