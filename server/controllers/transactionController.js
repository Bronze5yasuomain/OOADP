var express = require('express');
var app = express();
var Order = require('../models/order');
var executeTransaction = require('../models/transaction');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;


// List records from database
exports.list = function(req, res) {
    sequelize.query('select * from Transactions t join Orders o on t.orderid = o.Order_id', { model: executeTransaction, raw:true })
    .then((executeTransaction) => {
        console.log(executeTransaction)
        res.render('payment', {
            title:'Card Payment Details',
            transactionList: executeTransaction,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        })
    })
};

// Add a new student record to database
exports.insert = function (req, res) {
    // Create the user
    var transactionData = {
        buyer_id: req.body.buyer_id,
        item_id: req.body.item_id,
        name: req.body.name,
        card_name: req.body.card_name,
        card_number: req.body.card_number,
        expiry_month: req.body.expiry_month,
        expiry_year: req.body.expiry_year,
        cvc: req.body.cvc,
        price: req.body.price
    }
    // Save data
    executeTransaction.create(transactionData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/payment');
    }) 
};

// List one specific record from database
exports.editRecord = function(req, res) {
    var record_num = req.params.id;
    executeTransaction.findById(record_num).then(function (transactionRecord) {
        res.render('transaction', {
            title: "Transactions Record",
            transaction: transactionRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        })
    })
};

// Update transaction record in database
exports.update = function (req, res) {
    var record_num = req.params.id;
    var updateData = {
        name_on_card: req.body.name_on_card, 
        card_number: req.body.card_number,
        card_expiry_month: req.body.card_expiry_month,
        card_expiry_year: req.body.card_expiry_year,
        cvv_no: req.body.cvv_no
    }
    executeTransaction.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated transaction record:" + record_num });
    })
}

exports.delete = function(req, res) {
    var record_num = req.params.id;
    console.log("deleting" + record_num);
    executeTransaction.destroy({ where: { id: record_num} }).then((deletedRecord) => {
        if (!deletedRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted transaction record:" + record_num });
    });
}

// Transaction authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/transaction')
};