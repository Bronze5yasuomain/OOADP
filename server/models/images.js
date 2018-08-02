// models/images.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Images = sequelize.define('Images', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    imageName: {
        type: Sequelize.STRING
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

Images.sync({ force:false, logging:console.log }).then(()=> {
    console.log("Items synced");
    Images.upsert({
        id:1,
        created:2018-08-02,
        title:"IphoneImage",
        imageName:"iphone7",
        user_id:1
    })
})

// force: true will drop the table if it already exists
Images.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("images table synced");
});

module.exports = sequelize.model('Images', Images);
