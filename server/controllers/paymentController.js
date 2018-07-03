var Order = require('../models/payment');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.create = function (req, res) {
    var paymentData = {
        item: req.body.item,
        price: req.body.price,
        quantity: req.body.quantity,
    }
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
    Payment.findAll ({
        attributes: ['item', 'price', 'quantity', 'order_id']
    }).then(function (payment) {
        res.render('payment', {
            title:"Payment Page",
            paymentList: payment,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        });
    });
};

// exports.editRecord
// exports.update
// exports.delete

// Payment authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/payment');
}