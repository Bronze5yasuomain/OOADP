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

// Setup routes for images
app.post('/images', images.hasAuthorization, upload.single('image'), images.uploadImage);
app.get('/images-gallery', images.hasAuthorization, images.show);

// Setup chat
var io = require ('socket.io')(httpServer);
var chatConnections = 0;
var ChatMsg = require('./server/models/chatMsg');

io.on('connection', function(socket) {
    chatConnections++;
    console.log("Num of chat users connected: "+chatConnections);

    socket.on('disconnect', function() {
        chatConnections --;
        console.log("Num of chat users connected: "+chatConnections);
    });
})
app.get('/messages', function (req, res) {
    ChatMsg.findAll().then((chatMessages) => {
        res.render('chatMsg', {
            url: req.protocol + "://" + req.get("host") + req.url,
            data: chatMessages
        });
    });
});
app.post('/messages', function (req, res) {
    var chatData = {
        name: req.body.name,
        message: req.body.message
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