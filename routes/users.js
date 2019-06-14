const express = require('express');
const router = express.Router()
const User = require("../models").User
const authenticate = require('./login');
const bcryptjs = require("bcryptjs");

//GET current authorized User
router.get("/", authenticate, (req, res) => {
	res.json({
		id: req.currentUser.id,
		firstName: req.currentUser.emailAddress,
		lastName: req.currentUser.lastName,
		emailAddress: req.currentUser.emailAddress
	});
	res.status(200);
});

  

  



module.exports = router;




