var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Order = sequelize.define('Orders',{
    ItemName:{
        type: Sequelize.STRING,
        references: {
            model:'Items',
            key: 'name'
        }
    },
    ItemId:{
        type: Sequelize.INTEGER,
        references: {
            model:'Items',
            key: 'id'
        }
    },
    ItemPrice:{
        type: Sequelize.DOUBLE,
        references: {
            model:'Items',
            key: 'price'
        }
    },
    seller_id:{
        type: Sequelize.INTEGER,
        references:{
            model: 'Items',
            key:'seller_id'
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
        type: Sequlize.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    }
});

module.exports = sequelize.model('Orders', Order);