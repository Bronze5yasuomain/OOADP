var express = require('express');
var app = express();
var executeTransaction = require('../models/transaction');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

// Add a new student record to database
exports.insert = function (req, res) {
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
    executeTransaction.create(transactionData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/payment');
    }) 
};

// List records from database
exports.list = function(req, res) {
    sequelize.query('select u.id as buyer_id, i.id as item_id, u.name as name, t.card_name, t.card_number, t.expiry_month, t.expiry_year, t.cvc, i.price as price from Transactions t join Orders o on t.order_id = o.Order_id', 
    { model: executeTransaction, raw:true })
    .then((executeTransaction) => {
        res.render('transaction', {
            title:'Transactions',
            transactionList: executeTransaction,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        })
    })
};


// List one specific record from database
exports.editRecord = function(req, res) {
    var record_num = req.params.id;
    executeTransaction.findById(record_num).then(function (transactionRecord) {
        res.render('transaction', {
            title: "Transactions Record",
            item: transactionRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        })
    })
};

// exports.delete = function(req, res) {
//     var record_num = req.params.id;
//     console.log("deleting" + record_num);
//     executeTransaction.destroy({ where: { id: record_num} }).then((deletedRecord) => {
//         if (!deletedRecord) {
//             return res.send(400, {
//                 message: "error"
//             });
//         }
//         res.status(200).send({ message: "Deleted transaction record:" + record_num });
//     });
// }

// Transaction authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/transaction')
};