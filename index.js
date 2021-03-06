
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys

    // eslint-disable-next-line promise/catch-or-return
    var FCM = require('fcm-node');
    var serverKey = 'AAAAuvzuxTM:APA91bEFnoRRsFK6aCLUKGMFJjifPLAZX6yHmVXMjmzrFXbcBZeDMvN_13vaECsAHCCg8czuxdzOSN4hbgwUE4tPD9suv2pbOeeRoGwaz7Bg0JVrvdS10RIkaaxEEL7LcfHI0x4edcOoDF9kLkj-I0IN7sndOr5AOQ'; //put your server key here
    var fcm = new FCM(serverKey);
 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'ezGSyhveTpuD7JqmcufeKG:APA91bExNq4CZ_owzKhLnZnhP22Ya8bNJGKk419k9eIUeMh7TXT67u6HOkkikWyq8rf1OEA9xn6pyRpFCUQg3WfxJdayg2hG-XazTfVdhxaTsDc7NX_34kXC8pUDTFOc2s8m92E23cKV',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
