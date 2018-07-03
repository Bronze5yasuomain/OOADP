// models/profile.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Users = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    // address: {
    //     type: Sequelize.STRING
    // },
    // gender: {
    //     type: Sequelize.STRING
    // },
    // account_type: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //     defaultValue: "standard"
    // }
});

// force: true will drop the table if it already exists
Users.sync({force: false, logging:console.log}).then(()=>{
    console.log("users table synced");
    return Users.upsert({
        id: 1,
        name: 'Ben',
        email: 'a@b.com',
        password: '1234',
        // address: 'Blk 170 Jurong West Street 97, #18-30',
        // gender: 'Male',
    })
});

module.exports = sequelize.model('Users', Users);
