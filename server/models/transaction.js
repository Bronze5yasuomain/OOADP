var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const executeTransaction = sequelize.define('Transactions', {
    buyer_id:{
        type: Sequelize.INTEGER,
        references: {
            model:'Users',
            key: 'id'
        }
    },
    item_id: {
        type: Sequelize.INTEGER,
        references: {
            model:'Items',
            key: 'id'
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
})
