var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelizeInstance;
var Sequelize = myDatabase.Sequelize;

const ItemModel = sequelizeInstance.define('Items',{
    name:{
       type: Sequelize.STRING,
    },
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    price:{
        type: Sequelize.DOUBLE,
    },
    description:{
        type: Sequelize.STRING,

    },
    condition:{
        type: Sequelize.STRING,
    },
    category:{
        type: Sequelize.STRING,
    }
});

ItemModel.sync({ force:false, logging:console.log }).then(() => {
    console.log("Items synced");
    ItemModel.upsert({
        id:1,
        name:"Iphone 7 Plus",
        price:870.00,
        description:"5.5 inch Retina Display, A10 Fusion Chip",
        condition:"New",
        category:"Electronics",

    });
    console.log("Items synced");
    ItemModel.upsert({
        id:2,
        name:"Iphone 8 Plus",
        price:1470.00,
        description:"5.5 inch Retina Display, A11 Bionic Chip",
        condition:"New",
        category:"Electronics",

    });
});