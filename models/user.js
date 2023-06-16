const db = require('../data/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  async getUserWithSameEmail() {
    const existingUser = db
      .getDb()
      .collection('users')
      .findOne({ email: this.email });
    return existingUser;
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  async singup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    const dataUser = {
      email: this.email,
      password: hashedPassword,
    };
    console.log('Data User', dataUser);
    return db.getDb().collection('users').insertOne({
      email: this.email,
      password: hashedPassword,
    });
  }

  async login(comparePassword) {
    const resultComparePassword = await bcrypt.compare(
      this.password,
      comparePassword
    );
    console.log(resultComparePassword);
    return resultComparePassword;
  }
}

module.exports = User;
