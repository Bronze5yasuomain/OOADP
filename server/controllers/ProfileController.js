var ProfileModel = require('../models/profile');
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;

//List one specific user record from database
exports.editRecord = function (req, res) {
    var record_num = req.user.id;
    ProfileModel.findById(record_num).then(function (userRecord) {
        res.render('editprofile', {
            title: "Edit Profile Page",
            profile: userRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// List records from database
exports.list = function(req, res) {
    sequelize.query('select u.id, u.name, u.email, u.password, u.address, u.gender, u.account_type, u.name_on_card, u.card_number, u.card_expiry_month, u.card_expiry_year, u.cvv_no from Users u', 
    { model: ProfileModel, raw:true })
    .then((ProfileModel) => {
        res.render('profile', {
            title:'Profile',
            profileList: profileModel,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) =>{
        return res.status(400).send({
            message: err
        })
    })
};

//Update user record in database
exports.update = function (req, res) {
    var record_num = req.user.id;
    var updateData = {
        userId : req.body.userId,
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        address: req.body.address,
        password: req.body.password,
        name_on_card: req.body.name_on_card, 
        card_number: req.body.card_number,
        card_expiry_month: req.body.card_expiry_month,
        card_expiry_year: req.body.card_expiry_year,
        cvv_no: req.body.cvv_no
    }
    ProfileModel.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
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