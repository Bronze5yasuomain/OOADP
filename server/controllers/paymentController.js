var express = require('express');
var app = express();
const paypal = require('paypal-rest-sdk');
var executePayment = require('../models/payment');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

exports.success = function (req, res) {

    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;

    paypal.payment.execute(paymentId, executePayment, function (error, payment, req, res) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.end();
            }
    res.redirect('/browse') ;
        }
    )} 

// Create a new payment record into the database
exports.create = function (req, res) {
    // Create a new instance of the Payments model with request body
    var paymentData = {
        intent: req.body.intent,
        payment_method: req.body.payment_method,
        payment_id: req.body.payment_id,
        order_id: req.body.order_id,
        currency: req.body.currency,
        quantity: req.body.quantity,
        description: req.body.description,
        price: req.body.price,
    }

    // Save to database
    Payment.create(paymentData).then((newRecord, created) => {
        if(!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/payment');
    })
};

exports.list = function(req, res) {
    sequelize.query('select p.intent, p.payment_method, p.payment_id, o.Order_id as order_id, p.currency, o.Quantity as quantity, p.description, from Payments p join Orders o on p.order_id = o.Order_id', 
    { model: executePayment})
    .then((executePayment) => {
        res.render('payment', {
            title:'Payments',
            paymentList: executePayment,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        })
    })
};

// exports.editRecord
// exports.delete

// Payment authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/payment')
};