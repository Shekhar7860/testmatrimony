const functions = require("firebase-functions");

exports.sendPush = functions.https.onRequest((request, response) => {
	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here: https://dashboard.stripe.com/account/apikeys

	// eslint-disable-next-line promise/catch-or-return
	var FCM = require('fcm-node');
    var serverKey = 'AAAAuvzuxTM:APA91bEFnoRRsFK6aCLUKGMFJjifPLAZX6yHmVXMjmzrFXbcBZeDMvN_13vaECsAHCCg8czuxdzOSN4hbgwUE4tPD9suv2pbOeeRoGwaz7Bg0JVrvdS10RIkaaxEEL7LcfHI0x4edcOoDF9kLkj-I0IN7sndOr5AOQ'; //put your server key here
    var fcm = new FCM(serverKey);
 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'eLZrO3QIUUlvlOVDS_46CJ:APA91bFX4TZirAyviiSEE3se4hcIOhnFQHYoKhSCH8AC3UgehUKuCG44IeUr87uCw9QSvNgaCW2V1ygKJoQRzPgpSgnShja0VFJuTg21UixL_lL0kt3eLHdSyNjuCSpOEds7RnP39u6R',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
});
