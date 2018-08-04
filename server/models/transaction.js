var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const executeTransaction = sequelize.define('Transactions', {
    orderid: {
        type: Sequelize.INTEGER,
        references: {
            model:'Orders',
            key: 'Order_id'
        }
    },
});

executeTransaction.sync({force: false, logging:console.log}).then(()=>{
    console.log("Transactions table synced");
});

module.exports = sequelize.model('Transactions', executeTransaction);