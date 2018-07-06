var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const ItemModel = sequelize.define('Items',{
    name:{
       type: Sequelize.STRING,
    },
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,

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
    // quantity_left:{
    //     type: Sequelize.INTEGER,
    //     allowNull: false
    // },
    // seller_id:{
    //     type: Sequelize.INTEGER,
    //     references:{
    //         model: 'Users',
    //         key: 'id'
    //     }
    // }
});
module.exports = sequelize.model('Items', ItemModel);
ItemModel.sync({ force:false, logging:console.log }).then(() => {
    console.log("Items synced");
    ItemModel.upsert({
        id:1,
        name:"Iphone 7 Plus",
        price:870.00,
        description:"5.5 inch Retina Display, A10 Fusion Chip",
        condition:"New",
        category:"Electronics",
<<<<<<< HEAD
        // quantity_left: "2",
        // seller_id:"2",
=======
        quantity_left: 2,
        seller_id:1
>>>>>>> d31be5bb2f2934824c394b6ed0b3931dd94d8f20

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
});