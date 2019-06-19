'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models').sequelize;
const bodyParser = require('body-parser');
// set the port

const port = process.env.PORT || 5000;
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// TODO setup your routes here

const routes = require('./routes/index');

const userRoute = require('./routes/users');

const courseRoute = require('./routes/courses');

// TODO setup your api routes here

app.use('/api', routes);

app.use('/api/users', userRoute);

app.use('/api/courses',courseRoute);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);


// Test connection
sequelize.authenticate().then(() => {
	console.log('Connection has been established successfully.')
}).then(() => {
	app.listen(port, () => {
		console.log(`Express server is listening on port ${port}`)
	});
});