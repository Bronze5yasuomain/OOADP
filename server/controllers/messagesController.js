//Set up Chat function
var io = require ('socket.io')(httpServer);
var chatConnections = 0;
var ChatMsg = require('./server/models/chatMsg');

exports.messages = function (req, res){
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
                sendStatus(500);
            }
            io.emit('message', req.body)
            res.sendstatus(200)
        })
    });
}
