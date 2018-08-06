var express = require('express');
var app = express();
// var itemRecord = require('../models/items');
var carddetails = require('../models/carddetails');
var userRecord = require('../models/profile');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

// Add a new transaction record to database
exports.insert = function (req, res) {
    // Create the data
    var transactionData = {
        name_on_card: req.body.name_on_card,
        card_number: req.body.card_number,
        card_expiry_month: req.body.card_expiry_month,
        card_expiry_year: req.body.card_expiry_year,
        cvv_no: req.body.cvv_no,
    }
    // Save data
    carddetails.create(transactionData).then((newRecord, created) => {
        console.log('hi')
        console.log(newRecord)
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/transaction');
    }) 
};

// Render Add Payment Details Page
exports.list = function(req, res) {
    res.render('addpaymentdetails', {
        title:'Add Payment Details',
    })
};

// List all records from database
exports.show = function (req, res) {
    carddetails.findAll({
        attributes: ['details_id','name_on_card', 'card_number', 'card_expiry_month', 'card_expiry_year', 'cvv_no']
    }).then(function (carddetails) {
        res.render('carddetails', {
            title: "All Payment Records",
            detailsList: carddetails,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });    
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// Read a record from database
exports.editRecord = function(req, res) {
    sequelize.query('select u.id, i.id, i.name, u.name_on_card, u.card_number, u.card_expiry_month, u.card_expiry_year, u.cvv_no, i.price from Users u join Items i on i.seller_id = u.id', 
    { model: userRecord, raw:true }).then((transaction) => {
        console.log('hi')
        console.log(transaction)
        res.render('transaction', {
            title: "Transactions Record",
            transaction: transaction[0],
        })
    })
};
 
exports.delete = function(req, res) {
    var record_num = req.params.id;
    console.log('hi');
    console.log("deleting" + record_num);
    carddetails.destroy({ where: { details_id: record_num} }).then((deletedRecord) => {
        if (!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        // res.status(200).send({ message: "Deleted card record:" + record_num });
        res.redirect('/carddetails')
    });
}

// Transaction authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/transaction')
};