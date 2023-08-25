const express = require('express');
const PORT = 3000;
const path = require('path');
const expressSession = require('express-session');

const db = require('./data/database');
const authRoutes = require('./router/auth.routes');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddlewares = require('./middlewares/error-handler');
const createSessionConfig = require('./config/session');
const productsRoutes = require('./router/products.routes');
const baseRoutes = require('./router/base.routes');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);

app.use(errorHandlerMiddlewares);

db.connectToDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`http://localhost:${PORT}`);
			console.log('database terkoneksi online-store');
		});
	})
	.catch((error) => {
		console.error('Database gagal terkoneksi', error);
	});
