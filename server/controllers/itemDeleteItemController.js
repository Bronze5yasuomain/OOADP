var ItemModel = require('../models/items');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

exports.delete = function (req, res){
    var record_num = req.params.id;
    console.log("deleting"+record_num);
    ItemModel.destroy({where: {id: record_num} }).then((deletedRecord) => {
        if (!deletedRecord){
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Deleted item record:" + record_num});
    });
}