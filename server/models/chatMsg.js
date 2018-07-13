// models/chaMsg.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const ChatMsg = sequelize.define('ChatMsg', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    }
});

//force: true will frop the table if it already exists
ChatMsg.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("ChaeMsgs table synced");
});

module.exports = sequelize.model('ChatMsg', ChatMsg);


    }
    //save into database
    ChatMsg.create(chatData).then((newMessage) => {
        if(!newMessage) {
            snedStatus(500);
        }
        io.emit('message', req.body)
        res.sendstatus(200)
    })
});
