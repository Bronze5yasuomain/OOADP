var express = require('express');
var app = express();
var executeTransaction = require('../models/transaction');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

// exports.update = function(req, res) {
//     var record_num = req.params.id;
//     var updateData = {
//         buyer_id: req.body.buyer_id,
//         item_id: req.body.item_id,
//         name: req.body.name,
//         card_name: req.body.card_name,
//         card_number: req.body.card_number,
//         expiry_month: req.body.expiry_month,
//         expiry_year: req.body.expiry_year,
//         year: req.body.year,
//         price: req.body.price,
//     }

//     executeTransaction.update(updateData, { where: { id: record_num} }) .then((updatedRecord) => {
//         if (!updatedRecord || updatedRecord == 0) {
//             return res.send(400, {
//                 message: 'error'
//             });
//         }
//         res.status(200).send({ message: 'Updated payment record:' + record_num})
//     })
// }

// List all records from database
exports.list = function(req, res) {
    sequelize.query('select i.id as item_id, i.price as price from Payments p join Items i on p.item_id = i.id ', 
    { model: executeTransaction})
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
exports.payment = function(req, res) {
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