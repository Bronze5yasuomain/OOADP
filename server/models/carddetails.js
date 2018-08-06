var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const carddetails = sequelize.define('CardDetails', {
    details_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_on_card: {
        type: Sequelize.STRING,
    },
    card_number: {
        type: Sequelize.INTEGER,
    },
    card_expiry_month: {
        type: Sequelize.INTEGER,
    },
    card_expiry_year: {
        type: Sequelize.INTEGER,
    },
    cvv_no: {
        type: Sequelize.INTEGER,
    }
});

carddetails.sync({force: false, logging:console.log}).then(()=>{
    console.log("CardDetails table synced");
});

module.exports = sequelize.model('CardDetails', carddetails);