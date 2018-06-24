// get gravatar icon from email
var gravatar = require('gravatar');
// get EditProfile model
var EditProfileModel = require('../models/EditProfileModel')
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;
var sequelizeInstance = myDatabase.sequelizeInstance;

// List edit profile
exports.list = function (req, res) {
    sequelize.query('select e.id, e.title, e.name, e.country, e.gender, u.email AS [user_id] from EditProfileModel e join Users u on e.user_id = u.id', { model: EditProfileModel}).then ((editprofile) => {
 
             res.render('editprofile', {
                 title: 'Edit Profile Page',
                 editprofile: editprofile,
                 gravatar: gravatar.url(editprofile.user_id, { s: '80', r: 'x', d: 'retro' }, true),
                 urlPath: req.protocol + "://" + req.get("host") + req.url
             })
         }).catch((err)=>{
             return res.status(400).send({
             message: err
         });
     });
 };

//Add a new edit profile record to database
exports.insert = function (req, res) {
    var editprofileData = {
        name: req.body.username,
        country: req.body.country,
        gender: req.body.gender,
        user_id: req.user.id
    }
    EditProfileModel.create(editprofileData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message: "error"
            });
        }
        res.redirect('/editprofile');
    })
};

// List one specific edit profile record from database
exports.editProfile = function (req, res) {
    var record_num = req.params.id;
    EditProfileModel.findById(record_num).then(function (editProfileRecord) {
        res.render('editprofile2', {
            title: "Edit Profile Page 2",
            item: editProfileRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

//Update user record in database
exports.update = function (req, res) {
    var record_num = req.params.id;
    var updateData = {
        name: req.body.name,
        country: req.body.country,
        gender: req.body.gender,
        user_id: req.user.id
    }
    EditProfileModel.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated user record:" + record_num });
    })
}
// Edit Profile authorization middleware
exports.hasAuthorization = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}