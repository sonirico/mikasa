var Twitter = require('twitter');
var data = require('fs').readFileSync('mikasa.gif');

var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_SECRET
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 */
var tracks = "mikasa,#mikasa";

client.stream('statuses/filter', { track: tracks }, function (stream) {
    console.log('Listening streaming ...');

    stream.on('data', function (tweet) {
        
        client.post('media/upload', { media: data }, function (error, media, response) {

            if (! error) {

                // If successful, a media object will be returned.
                // console.log(media);

                // Lets tweet it
                var status = {
                    in_reply_to_status_id: tweet.id_str,
                    status: '@' + tweet.user.screen_name + ' Let\'s get hurt!',
                    media_ids: media.media_id_string // Pass the media id string
                };

                client.post('statuses/update', status, function (error, tweet, response) {
                    if (!error) {
                        console.log(tweet);
                    }
                });

            } else {
                console.log(error);
            }
        });
    });

    stream.on('error', function (error) {
        console.log(error);
    });
});
