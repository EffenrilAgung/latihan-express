function postIsValid(title, content) {
  return title && content && content.trim() !== '' && title.trim() !== '';
}

function userCredentialsAreValid(email, confirmEmail, password) {
  return (
    email &&
    confirmEmail &&
    password &&
    password.trim().length >= 6 &&
    email === confirmEmail &&
    email.includes('@')
  );
}

module.exports = {
  postIsValid: postIsValid,
  userCredentialsAreValid: userCredentialsAreValid,
};
