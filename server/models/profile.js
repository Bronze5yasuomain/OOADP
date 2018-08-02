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
    address: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    account_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "standard"
    },
    name_on_card: {
        type: Sequelize.STRING
    },
    card_number: {
        type: Sequelize.STRING
    },
    card_expiry_month: {
        type: Sequelize.STRING
    },
    card_expiry_year: {
        type: Sequelize.STRING
    },
    cvv_no: {
        type: Sequelize.STRING
    }
});

// force: true will drop the table if it already exists
Users.sync({force: false, logging:console.log}).then(()=>{
    console.log("users table synced");
    return Users.upsert({
        id: 1,
        name: 'Ben',
        email: 'a@b.com',
        password: '1234',
        address: 'Blk 170 Jurong West Street 97, 18-30',
        gender: 'Male',
        account_type: 'default',
        name_on_card: 'Ben Leo Jun Ming',
        card_number: '4275 3156 0372 5493',
        card_expiry_month: '01',
        card_expiry_year: '19',
        cvv_no: '567'
    })
});

module.exports = sequelize.model('Users', Users);
