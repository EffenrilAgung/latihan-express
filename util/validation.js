function isEmpty(value) {
	return !value || value.trim() === '';
}

function userCredentialsAreValid(email, confirmEmail, password) {
	return (
		email &&
		confirmEmail &&
		email.includes('@') &&
		confirmEmail.includes('@') &&
		password &&
		password.trim().length >= 6
	);
}

function userDetailsAreValid(
	email,
	confirmEmail,
	password,
	name,
	street,
	postal,
	city
) {
	return (
		userCredentialsAreValid(email, confirmEmail, password) &&
		isEmpty(name) &&
		isEmpty(street) &&
		isEmpty(postal) &&
		isEmpty(city)
	);
}

function emailIsConfirmed(email, confirmEmail) {
	return email === confirmEmail;
}

module.exports = {
	userDetailsAreValid: userDetailsAreValid,
	emailIsConfirmed: emailIsConfirmed,
};
