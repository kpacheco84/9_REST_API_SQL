'use strict';
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;



module.exports = (req, res, next) => {
	//Create placeholder for errors
	let message = null;
	//Grab credentials from Auth header
	const credentials = auth(req);
	//If credentials exist...
	if (credentials) {
		//Query the DB for User with matching email address
		User.findOne({
			where: {
				emailAddress: credentials.name
			}
		}).then(user => {
			//If matching email found
			if (user) {
				//Check password
				let authenticated = bcryptjs.compareSync(credentials.pass, user.password);
				//If password matches
				if (authenticated) {
					//Store User in request
					req.currentUser = user;
					//Advance to next middleware
					next();
				} else {
					//If password doesn't match
					message = "That password does not match our records";
					//Set status code
					res.status(401);
					//Send message
					res.json({
						message: message
					});
				}
			} else {
				//If no matching email address
				message = "We could not find that email address in our system. Please try again.";
				//Set status code
				res.status(401);
				//Send message
				res.json({
					message: message
				});
			}
		});
	} else {
		//If empty credentials Send error
		const err = new Error('You have not entered the sufficient credentials');
		err.status = 401;
		next(err);
	}
};