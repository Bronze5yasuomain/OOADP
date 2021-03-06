// Import basic modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const ejs = require('ejs'); 

// import multer
var multer = require('multer');
var upload = multer({ dest:'./public/uploads', limits: {fileSize: 1500000, files:1} });

var httpServer = require('http').Server(app);

// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');

// Import keys from config
var keys = require('./server/config/transactionkeys');

// Import from stripe 
var stripe = require('stripe')(keys.stripeSecretKey);
 
// Modules to store session
var myDatabase = require('./server/controllers/database');
var expressSession = require('express-session');
var SessionStore = require('express-session-sequelize')(expressSession.Store);
var sequelizeSessionStore = new SessionStore({
    db: myDatabase.sequelize,
});
// Import Passport and Warning flash modules
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
// var serverPort = 4000;
// var httpServer = require('http').Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// Passport configuration
require('./server/config/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));

// Setup public directory
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(expressSession({
    secret: 'sometextgohere',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.use(flash());

// Application Routes
// Index Route
app.get('/', index.show);
app.get('/login', auth.signin);
app.post('/login', passport.authenticate('local-login', {
    //Success go to Home Page / Fail go to login page
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/signup', auth.signup);
app.post('/signup', passport.authenticate('local-signup', {
    //Success go to Profile Page / Fail go to Signup page
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// Import listings controller
var listings = require('./server/controllers/listingsController');
//app.get('/profile',  auth.profile);
app.get('/profile', listings.hasAuthorization, listings.show);
app.post('/profile', listings.hasAuthorization, upload.single('image'), listings.uploadImage);
//app.get('/profile', auth.isLoggedIn, auth.profile);


// Transaction route
var transactionController = require('./server/controllers/transactionController')

// app.get('/payment', transactionController.hasAuthorization, transactionController.list)
app.get('/addpaymentdetails', transactionController.hasAuthorization, transactionController.list)
app.post('/addpaymentdetails', transactionController.hasAuthorization, transactionController.insert)
app.get('/carddetails', transactionController.hasAuthorization, transactionController.show)
// app.get('/transaction/:id', transactionController.hasAuthorization, transactionController.editRecord)
// app.post('/transaction/:id', transactionController.hasAuthorization, transactionController.show)
app.get('/carddetails/:id', transactionController.hasAuthorization, transactionController.delete)
// app.post('/transaction/:id', transactionController.hasAuthorization, transactionController.update)

// app.get('/cancel', function (req, res) {
//     req.cancel();
//     res.send('Transaction is cancelled')
// })

// Logout Page
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = app;

// app.set('port', serverPort);

// var server = httpServer.listen(app.get('port'), function () {
//     console.log('http server listening on port ' + server.address().port);
// });

//item listing controller routes
var itemCreateItemController = require("./server/controllers/itemCreateItemController")
var itemEditItemController = require("./server/controllers/itemEditItemController")
var itemListController = require("./server/controllers/itemListController")
var itemViewIndividualController = require("./server/controllers/itemViewIndividualController")
var itemsControllerExample = require("./server/controllers/itemsControllerExample")
var imageController = require("./server/controllers/imageController")

app.get("/browse", itemListController.list, itemViewIndividualController.list, itemsControllerExample.list);
app.get("/browse", itemEditItemController.hasAuthorization, itemEditItemController.editRecord, itemsControllerExample.editRecord)
app.post("/browse", itemCreateItemController.insert, itemsControllerExample.insert);
app.post("/browse", itemsControllerExample.update);
app.delete("/browse", itemsControllerExample.delete);
app.get("/item", itemViewIndividualController.list);

app.get("/item", itemListController.list, itemViewIndividualController.list, itemsControllerExample.list);

var orderController = require("./server/controllers/orderController")
app.get("/orders", orderController.list);

var ProfileController = require("./server/controllers/ProfileController")
//read
app.get("/editprofile", ProfileController.hasAuthorization, ProfileController.editRecord);
//write
app.post("/editprofile", ProfileController.hasAuthorization, ProfileController.update);

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
        name2:req.body.name,
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(4000, ()=> {
    console.log("Server started.")
})

