var express = require('express');
var app = express();
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Payment = sequelize.define('Payments', {
    item: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    price: {
        type: Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.INTEGER
    },
});

// force: true will drop the table if it already exists
Payment.sync({force: false, logging:console.log}).then(()=>{
    console.log("Payment table synced");
    return Payment.upsert({
        item: 'Red Sox Hat',
        price: '25',
        quantity: 1,
    })
});

app.post('/payment', (req, res) => {
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

module.exports = sequelize.model('Payments', Payment);


