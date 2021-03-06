const functions = require("firebase-functions");
const stripe = require("stripe")(
	"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"
);

exports.payWithStripe = functions.https.onRequest((request, response) => {
	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here: https://dashboard.stripe.com/account/apikeys

	// eslint-disable-next-line promise/catch-or-return
	stripe.paymentIntents
		.create({
			amount: 100,
			currency: "inr",
		})
		.then((charge) => {
			// asynchronously called
			response.send(charge);
			return charge;
		})
		.catch((err) => {
			console.log(err);
		});
});
