const path = require('path');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session');
const express = require('express');
const db = require('./data/database');
const demoRoutes = require('./routes/demo');

const MongoDBStore = mongodbSession(session);

const app = express();

const sessionStore = new MongoDBStore(
  {
    uri: 'mongodb://localhost:27017',
    databaseName: 'auth-demo',
    collection: 'session',
  },
  function (error) {
    if (error) {
      console.log(error);
    }
  }
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(demoRoutes);

app.use(function (error, req, res, next) {
  res.render('500');
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
