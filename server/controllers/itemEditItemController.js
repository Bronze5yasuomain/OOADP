var ItemModel = require('../models/items');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.editRecord = function (req, res) {
    var record_num = req.params.id;
    ItemModel.findById(record_num).then(function (itemRecord){
        res.render('editRecord', {
            title: "Item list",
            item: itemRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};