var ItemModel = require('../models/items');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.insert = function (req,res) {
    var itemdata = {
        name: req.body.name,
        id: req.body.id,
        price: req.body.price,
        description: req.body.description,
        condition: req.body.condition,
        category: req.body.category,
        quantity_left: req.body.quantity_left,
        seller_id: req.body.seller_id,
    }
    ItemModel.create(itemdata).then((newRecord, created) => {
        if (!newRecord){
            return res.send(400,{
                message:"error"
            });
        }
        res.redirect('/');
    })
};

