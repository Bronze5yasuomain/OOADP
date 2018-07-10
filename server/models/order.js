var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Order = sequelize.define('Orders',{
    ItemId:{
        type: Sequelize.INTEGER,
        references: {
            model:'Items',
            key: 'id'
        }
    },
    Quantity:{
        type: Sequelize.INTEGER,

    },
    Buyer_id:{
        type: Sequelize.INTEGER,
        references:{
            model: 'Users',
            key: 'id'
        }
    },
    Order_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    }
});

Order.sync({ force:false, logging:console.log }).then(() => {
    console.log("Orders synced");
    Order.upsert({
        ItemId:1,
        Quantity:1,
        Buyer_id:1,
        Order_id:1


    });

});
module.exports = sequelize.model('Orders', Order);