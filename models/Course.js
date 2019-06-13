
'use strict';



module.exports = (sequelize, DataTypes) => {

  const Course = sequelize.define('Course', {

    id: {

      type: DataTypes.INTEGER,

      primaryKey: true,

      autoIncrement: true,

    },

    title: {

      type: DataTypes.STRING,

      allowNull: false,

      validate: {

        notEmpty: {

          msg: "Please enter a course title"

        }

      }

    },

    description:{

      type: DataTypes.TEXT,

      allowNull: false,

      validate: {

        notEmpty: {

          msg: "Please enter a course description"

        }

      }

    },

    estimatedTime: {

      type: DataTypes.STRING,

      allowNull: true,

    },

    materialsNeeded: {

        type: DataTypes.STRING,

        allowNull: true,

      },

  });



  Course.associate = (models) => {

  //create associations

   Course.belongsTo(models.User, { foreignKey: "userId"});

  };



  return Course;

};