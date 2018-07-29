Stripe.setPublishableKey('pk_test_EVfW5ba35k80G6QDSyVeU5TW');

var $form = $('transaction-form');

$form.submit(function (event) {
    $('#pay-error').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        name: $('#card-name').val(),
        number: $('#card-number').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        cvc: $('#card-cvc').val(),
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) {  // Problems

        // Show the errors on the form itself
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission
    }
    else { // Token created

        // Get the token ID:
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));

        // Submit the form
        $form.get(1).submit();
    }
}