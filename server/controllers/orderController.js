var Order = require('../models/order');
var Item = require('../models/items');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req, res) {
    var orderData = {
        ItemId: req.body.ItemId,
        Quantity: req.body.Quantity,
        Buyer_id: req.body.Buyer_id,
        Order_id: req.body.Order_id
    }
    Order.create(orderData).then((newRecord, created) => {
        if(!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/order');
    })
};
exports.list = function (req, res) {
    sequelize.query('select o.Quantity, o.ItemId, o.Buyer_id, o.Order_id, i.name as Item_Name, i.price as Item_Price, i.seller_id as Seller_id from Orders o join Items i on o.ItemId = i.id',{ model: Order })
    .then((orderAndItem) => {
        // console.log(order)
        res.render('orders', {
            title:"Order Management",
            orderList: orderAndItem,
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