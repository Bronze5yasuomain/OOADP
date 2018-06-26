var Order = require('../models/order');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req, res) {
    var orderData = {
        ItemName: req.body.ItemName,
        ItemId: req.body.ItemId,
        ItemPrice: req.body.ItemPrice,
        seller_id: req.body.seller_id,
        Quantity: req.body.Quantity,
        Buyer_id: req.body.Buyer_id,
        Order_id: req.body.Order_id
        }
}
Order.create(orderData).then((newRecord, created) => {
    if(!newRecord) {
        return res.send(400, {
            message: "error"
        });
    }
    res.redirect('/order');
});
exports.list = function (req, res) {
    orderData.findAll({
        attributes: ['ItemName', 'ItemId', 'ItemPrice', 'seller_id', 'Quantity', 'Buyer_id', 'Order_id']
    }).then(function (order) {
        res.render('order', {
            title:"Order Management",
            orderList: order,
            urlPath: req.protocol + "://" + req.get("host") + req.urlPath           
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};
exports.editRecord = function (req, res) {
    var record_num = req.params.id;
    orderData.findById(record_num).then(function (orderRecord){
        res.render('editRecord', {
            title: "Order List",
            item: orderRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.update=function(req, res){
    var record_num = req.params.id;
    var updateData = {
        ItemName: req.body.ItemName,
        ItemId: req.body.ItemId,
        ItemPrice: req.body.ItemPrice,
        seller_id: req.body.seller_id,
        Quantity: req.body.Quantity,
        Buyer_id: req.body.Buyer_id,
        Order_id: req.body.Order_id
    }
    orderData.update(updateData,{where:{id:record_num} }).then((updatedRecord)=>{
        if (!updatedRecord || updatedRecord == 0){
            return res.send(400, {
                message:"error"
            });
        }
        res.status(200).send({message: "Updated Order record:" + record_num});
    })
}

exports.delete = function (req, res){
    var record_num = req.params.id;
    console.log("deleting"+record_num);
    orderData.destroy({where: {id: record_num} }).then((deletedRecord) => {
        if (!deletedRecord){
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted order record:" + record_num});
    });
}