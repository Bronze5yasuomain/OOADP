var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

gateway.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (result.success) {
      // See result.transaction for details
    } else {
      // Handle errors
    }
  });

gateway.transaction.submitForSettlement("theTransactionId", function (err, result) {
    if (result.success) {
      var settledTransaction = result.transaction;
    } else {
      console.log(result.errors);
    }
});

    

