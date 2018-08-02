var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const executeTransaction = sequelize.define('Transactions', {
    order_id:{
        type: Sequelize.INTEGER,
        references: {
            model:'Orders',
            key: 'Order_id'
        }
    },
    card_name: {
        type: Sequelize.STRING,
    },
    card_number: {
        type: Sequelize.INTEGER,
    },
    expiry_month: {
        type: Sequelize.INTEGER,
    },
    expiry_year: {
        type: Sequelize.INTEGER,
    },
    cvc: {
        type: Sequelize.INTEGER,
    },
});

executeTransaction.sync({force: false, logging:console.log}).then(()=>{
    console.log("Transactions table synced");
});

module.exports = sequelize.model('Transactions', executeTransaction);