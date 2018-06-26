// Import basic modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

// Import home controller
var index = require('./server/controllers/index');
// Import login controller
var auth = require('./server/controllers/auth');

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
var serverPort = 4000;
var httpServer = require('http').Server(app);

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
    //Success go to Profile Page / Fail go to login page
    successRedirect: '/profile',
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

app.get('/profile', auth.isLoggedIn, auth.profile);

app.get('/payment', (req, res) => res.render('payment'));

// Payment routes
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AXK_C3j9Kcqx9QPqx5wOFQmoknKQgriKeGpTOfkEMo9HpK1RF6jHaEYPj2Ccexl_TU13_pso_e8TzW9m',
    'client_secret': 'ECVVyoDOvvcUS8qyDwRIjxSRQ_CqxWSI_JobPHbbcVrJB1NufXTlIfOHv6O_GFqnowqvUHU1NWj05SKb'
})


app.post('/transaction', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4000/success",
            "cancel_url": "http://localhost:4000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "SGD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "SGD",
                "total": "25.00"
            },
            "description": "Hat for the best team ever."
        }]
    };    

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i= 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }   
            console.log(JSON.stringify(payment));    
        }
    });
});
    
app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('success');
        }
    })    
});

app.get('/cancel', (req, res) => res.send('Cancelled'));


// Logout Page
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
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

module.exports = app;

app.set('port', serverPort);

var server = httpServer.listen(app.get('port'), function () {
    console.log('http server listening on port ' + server.address().port);
});

var itemsController = require("./server/controllers/itemsController")
app.get("/", itemsController.list);
app.get("/edit/:id", itemsController.editRecord)
app.post("/new", itemsController.insert);
app.post("/edit/:id", itemsController.update);
app.delete("/:id", itemsController.delete);


app.get("/orders", orderController.list);
