var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const executeTransaction = sequelize.define('Transactions', {
    updateintent: {
        type: Sequelize.STRING,
    },
    updatepayment_method: {
        type: Sequelize.STRING,
    },
    updatepayment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    updateorder_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Orders',
            key: 'Order_id'
        }
    },
    updatecurrency: {
        type: Sequelize.STRING
    },
    updatequantity: {
        type: Sequelize.INTEGER
    },
    updatedescription: {
        type: Sequelize.STRING
    },
});

executeTransaction.sync({force: false, logging:console.log}).then(()=>{
    // Table
    console.log("Transactions table synced");
})
