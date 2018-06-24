// models/EditProfileModel.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize,
Sequelize = myDatabase.Sequelize;

const EditProfileModel = sequelize.define('EditProfile', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
         type: Sequelize.STRING,
         defaultValue: '',
         trim: true
    },
    country: {
         type: Sequelize.STRING,
         defaultValue: '',
         trim: true
    },
    gender: {
         type: Sequelize.STRING,
         defaultValue: '',
         trim: true
     },
     user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

// force: true will drop the table if it already exists
EditProfileModel.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("Edit Profile table synced");
    return EditProfileModel.upsert({
        id:1,
        name: "Betty",
        country: "Korea",
        gender: "Female"
    });
});