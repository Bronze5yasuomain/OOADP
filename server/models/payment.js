const paypal = require('paypal-rest-sdk');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const executePayment = sequelize.define('Payments', {
    intent: {
        type: Sequelize.STRING,
    },
    payment_method: {
        type: Sequelize.STRING,
    },
    payment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Orders',
            key: 'Order_id'
        }
    },
    currency: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.INTEGER
    },
});


paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AXK_C3j9Kcqx9QPqx5wOFQmoknKQgriKeGpTOfkEMo9HpK1RF6jHaEYPj2Ccexl_TU13_pso_e8TzW9m',
    'client_secret': 'ECVVyoDOvvcUS8qyDwRIjxSRQ_CqxWSI_JobPHbbcVrJB1NufXTlIfOHv6O_GFqnowqvUHU1NWj05SKb'
});
    
executePayment.sync({force: false, logging:console.log}).then(()=>{
    console.log("Payment table synced");
    return executePayment.upsert({
        intent: 'sale',
        payment_method: 'paypal',
        payment_id: 1,
        order_id: 1,
        currency: 'SGD',
        quantity: 1,
        description:'This is the payment description',
    })
});
 
module.exports = sequelize.model('Payments', executePayment);


