var express = require('express');
var app = express();
var executeTransaction = require('../models/transaction');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

exports.update = function(req, res) {
    var record_num = req.params.id;
    var updateData = {
        updateintent: req.body.intent,
        updatepayment_method: req.body.payment_method,
        updatepayment_id: req.body.payment_id,
        updateorder_id: req.body.order_id,
        updatecurrency: req.body.currency,
        updatequantity: req.body.quantity,
        updatedescription: req.body.description,
        updateprice: req.body.price,
    }

    executeTransaction.update(updateData, { where: { id: record_num} }) .then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: 'error'
            });
        }
        res.status(200).send({ message: 'Updated payment record:' + record_num})
    })
}

exports.list = function(req, res) {
    sequelize.query('select p.updateintent, p.updatepayment_method, p.updatepayment_id, o.Order_id as updateorder_id, p.updatecurrency, p.updatequantity, p.updatedescription, p.updateprice from Payments p join Orders o on p.updateorder_id = o.Order_id', 
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

exports.editRecord = function(req, res) {
    var record_num = req.params.id;
    executeTransaction.findById(record_num).then(function (transactionRecord) {
        res.render('editRecord', {
            title: "Edit Transactions Record",
            item: transactionRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    });
};

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

// Payment authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/payment')
};