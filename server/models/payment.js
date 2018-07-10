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
    payer_id: {
        type: Sequelize.STRING,
    },
    item_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    item: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.INTEGER
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
        payer_id: 'weixiang54@ymail.com',
        item_id: 'rsh',
        item: 'Red Sox Hat',
        price: '25',
        currency: 'SGD',
        quantity: 1,
        description:'This is the payment description',
    })
});
 
module.exports = sequelize.model('Payments', executePayment);


