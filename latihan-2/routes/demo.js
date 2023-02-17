const express = require('express');

const db = require('../data/database');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/signup', async function (req, res) {
  const userData = req.body;

  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData['confirm-email'];
  const enteredPassword = userData.password;

  const checkUser = db
    .getDb()
    .collection('users')
    .findOne({ email: enteredEmail });

  if (
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredEmail !== enteredConfirmEmail ||
    enteredPassword.trim().length < 6 ||
    !enteredEmail.includes('@')
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Data tidak sesuai - ulangi kembali',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };
    req.session.save(() => {
      res.redirect('/signup');
    });
    return;
  }

  if (checkUser) {
    req.session.inputData = {
      hasError: true,
      message: 'email sudah terdaftar',
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };
    req.session.save(() => {
      res.redirect('/signup');
    });
    return;
  }

  // * bycrpt password
  const hashedPassword = await bcrypt.genSalt(10).then((salt) => {
    return bcrypt.hash(enteredPassword, salt);
  });

  console.log(hashedPassword);

  const data = { email: enteredEmail, password: hashedPassword };

  await db.getDb().collection('users').insertOne(data);

  res.redirect('/login');
});

router.post('/login', async function (req, res) {
  const formData = req.body;
  const enteredEmail = formData.email;
  const enteredPassword = formData.password;

  console.log(req.session);

  const users = await db
    .getDb()
    .collection('users')
    .findOne({ email: enteredEmail });

  if (!users) {
    req.session.inputData = {
      hasError: true,
      message: 'Anda tidak dapat Login harap check kembali data',
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect('/login');
    });
    return;
  }

  //* compare password
  const passwordAreEqual = await bcrypt.compare(
    enteredPassword,
    users.password
  );

  if (!passwordAreEqual) {
    req.session.inputData = {
      hasError: true,
      message: 'Password Salah Cek Kembali',
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(() => {
      res.redirect('/login');
    });
    return;
  }

  req.session.user = {
    id: users._id,
    email: users.email,
  };
  req.session.isAuthenticated = true;

  req.session.save(() => {
    res.redirect('/profile');
  });
  return;
});

router.get('/profile', async function (req, res) {
  res.render('profile');
});

router.get('/admin', function (req, res) {
  res.render('admin');
});

router.post('/logout', function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    req.session = null;
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
