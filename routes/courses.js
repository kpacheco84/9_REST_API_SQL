const express = require('express');
const router = express.Router();
const Course = require("../models").Course;
const User = require("../models").User;
const authenticate = require('./login');
//GET a list of Courses
router.get('/', (req, res, next) => {
	Course.findAll({
		// specify fields 
		attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"],
		// include the User's info
		include: [{
			model: User,
			//specify fields 
			attributes: ["id", "firstName", "lastName", "emailAddress"]
		}]
	}).then(courses => {
		//course list in reponse
		res.json(courses);
		//set 200 Status Code
		res.status(200);
		//catch error
	}).catch(err => {
		err.status = 400;
		next(err);
	});
});
//GET Course by ID
router.get('/:id', (req, res, next) => {
	//grab id from request as param
	const info = req.params;
	//filter by course id
	Course.findOne({
		where: {
			id: info.id
		},
		// specify fields
		attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"],
		include: [{
			model: User,
			attributes: ["id", "firstName", "lastName", "emailAddress"]
		}]
	}).then(course => {
		if (course) {
			//course list
			res.json(course);
			//status code 200
			res.status(200);
		} else {
			//send error
			const err = new Error('There is no course with that id');
			err.status = 400;
			next(err);
		}
	});
})
// POST Create Course
router.post("/", authenticate, (req, res, next) => {
	//grab info from req
	const info = req.body;
	//require title to be entered
	if (!info.title) {
		const err = new Error('Please enter a title for your Course');
		err.status = 400;
		next(err);
	} else {
		// find if course already exists
		Course.findOne({
			where: {
				title: info.title
			}
		}).then(title => {
			//if course already exists
			if (title) {
				//send error
				const err = new Error('This course already exists');
				err.status = 400;
				next(err);
			} else {
				//set user as course user
				info.userId = req.currentUser.id;
				//create the course
				Course.create(info).then(course => {
						console.log("Your course has been created");
						res.location('/api/courses/' + course.id);
						res.status(201).end();
					})
					//Catch error and check if Sequelize validation  error (not using) and pass error to next middleware
					.catch(err => {
						if (err.name === "SequelizeValidationError") {
							err.message = "Please enter all required fields";
							err.status = 400;
							next(err);
						} else {
							err.status = 400;
							next(err);
						}
					});
			}
		})
	}
});


//PUT update a course info
router.put('/:id', authenticate, (req, res, next) => {
	//Grab info from request
	const info = req.body;
	if (!info.title && !info.description) {
		const err = new Error('Please enter a title and a description.');
		err.status = 400;
		next(err);
	} else if (!info.title) {
		const err = new Error('Please enter a title.');
		err.status = 400;
		next(err);
	} else if (!info.description) {
		const err = new Error('Please enter a description.');
		err.status = 400;
		next(err);
	} else {//const info = req.body;
	//Filter for Course by ID
	Course.findOne({
		where: {
			id: info.id
		}
	}).then(course => {
		
		//check if user owns the course
		if (course.userId !== req.currentUser.id) {
			//send error
			const err = new Error('You are only allowed to edit your own course');
			err.status = 403;
			next(err);
		} else if (course) {
			//update Course
			course.update(info);
		} else {
			//Send error
			const err = new Error('We can not find a Course by that ID');
			err.status = 400;
			next(err);
		}
	}).then(() => {
		//On Success
		console.log("Your course has been edited");
		res.status(204).end();
	}).catch(err => {
		if (err.name === "SequelizeValidationError") {
			err.message = "All data must be entered";
			err.status = 400;
			next(err);
		} else {
			err.status = 400;
			next(err);
		}
	})
}
});
//Delete a Course
router.delete('/:id', authenticate, (req, res, next) => {
	//Grab info from request
	//const info = req.params.id;
	//Filter for Course by ID
	Course.findByPk(req.params.id)
	.then(course => {
		console.log(`userId= ${course.userId} id = ${req.currentUser.id}`);
		//If user doesn't own course
		if (course.userId !== req.currentUser.id) {
			//Send error
			const err = new Error('You can only delete your own course');
			err.status = 403;
			next(err);
		} else if (course) {
			//Delete Course
			course.destroy();
			console.log("Your course has been deleted");
			res.status(204).end();
		} else {
			//Send error
			const err = new Error('We can not find a Course by that ID');
			err.status = 400;
			next(err);
		}
	}).catch(err => {
		if (err.name === "SequelizeValidationError") {
			err.message = "All data must be entered";
			err.status = 400;
			next(err);
		} else {
			err.status = 400;
			next(err);
		}
	})
});
module.exports = router;