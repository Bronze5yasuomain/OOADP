var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

gateway.customer.create({
    firstName: "Jen",
    lastName: "Smith",
    company: "Braintree",
    email: "jen@example.com",
    phone: "312.555.1234",
    fax: "614.555.5678",
    website: "www.example.com"
  }, function (err, result) {
    result.success;
    // true
  
    result.customer.id;
    // e.g. 494019
  });