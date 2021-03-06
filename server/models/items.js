var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const ItemModel = sequelize.define('Items',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        
    },
    name: {
        type: Sequelize.STRING
    },
    price:{
        type: Sequelize.DOUBLE,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: true

    },
    condition:{
        type: Sequelize.STRING,
    },
    category:{
        type: Sequelize.STRING,
    },
    quantity_left:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    seller_id:{
        type: Sequelize.INTEGER,
        references:{
            model: 'Users',
            key: 'id'
        }
    }
});

ItemModel.sync({ force:false, logging:console.log }).then(() => {
    console.log("Items synced");
    ItemModel.upsert({
        id:1,
        category:"Sports Shoe",
        name:"Nike Free RN 2018",
        description:"Made for short runs, from your daily 5K to that spontaneous sprint, the Nike Free RN 2018 Men's Running Shoe is as flexible as ever. The innovative sole has an updated design, yet still delivers a comfortable, barefoot-like feel.",
        price:165.00,
        condition:"New",
        quantity_left: 2,
        seller_id: 1
    });
});


//     console.log("Items synced");
//     ItemModel.upsert({
//         id:2,
//         name:"Iphone 8 Plus",
//         price:1470.00,
//         description:"5.5 inch Retina Display, A11 Bionic Chip",
//         condition:"New",
//         category:"Electronics",

//     });


module.exports = sequelize.model('Items', ItemModel);
