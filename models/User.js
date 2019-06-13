'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please enter a First Name"
				},
				isAlpha: true,
				len: [2 - 20]
			}
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please enter a Last Name"
				},
				isAlpha: true,
				len: [2 - 20]
			}
		},
		emailAddress: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Please enter an email address"
				},
				isEmail: {
					msg: "Please enter a valid email address"
				}
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "You must enter a password"
				}
			}
		},
	});
	User.associate = (models) => {
		// create association
		User.hasMany(models.Course, {
			foreignKey: "userId"
		});
	};
	return User;
};