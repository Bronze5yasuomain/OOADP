var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Payments = sequelize.define('Payments', {
    item: {
        type: Sequelize.STRING,
        autoIncrement: true,
        primaryKey: true
    },
    price: {
        type: Sequelize.INTEGER
    },
});

// force: true will drop the table if it already exists
Payments.sync({force: false, logging:console.log}).then(()=>{
    console.log("Payment table synced");
    return Users.upsert({
        item: 'Red Sox Hat',
        price: '$25'
    })
});

module.exports = sequelize.model('Payments', Payments);
