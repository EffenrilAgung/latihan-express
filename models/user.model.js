const bcrypt = require('bcrypt');
const formatTime = require('../util/time');

const db = require('../data/database');

class User {
	constructor(email, password, fullname, street, postal, city) {
		this.email = email;
		this.password = password;
		(this.name = fullname),
			(this.address = {
				street: street,
				postalCode: postal,
				city: city,
			});
	}

	async getUserWithSameEmail() {
		try {
			const result = await db
				.getDb()
				.collection('users')
				.findOne({ email: this.email });
			return result;
		} catch (error) {
			console.error(error);
		}
		return;
	}

	async signup() {
		const hashedPassword = await bcrypt.hash(this.password, 12);

		const result = await db.getDb().collection('users').insertOne({
			email: this.email,
			password: hashedPassword,
			name: this.name,
			address: this.address,
			create_at: formatTime(),
			update_at: formatTime(),
		});
		console.log('User di tambahkan', result);
		return;
	}

	async hasMachingPassword(hashedPassword) {
		try {
			const result = await bcrypt.compare(this.password, hashedPassword);
			console.log(result, 'password compare`');
			return result;
		} catch (error) {
			console.error(error);
		}
		return;
	}
}

module.exports = User;
