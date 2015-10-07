var TweetUtils = require('tweet-utils-js');

function createTwitterConnection(twitterCredentials, boundingBox, payloadCallback) {
  var Twitter = require('twitter');
  var twitterConnection = new Twitter(twitterCredentials);
  startFileringGeocodedTweets();

  function startFileringGeocodedTweets() {
    twitterConnection.stream(
      'statuses/filter',
      { locations: boundingBox },
      twitterStreamHandler
    );
  }

  function twitterStreamHandler(stream) {
    stream.on('error', function(error) {
      throw error;
    });

    stream.on('data', function(tweet) {
      var payload = buildPayload(tweet);
      if (payload) {
        payloadCallback(payload);
      }
    });
  }
}

function buildPayload(tweet) {
  var coordinates = TweetUtils.extractGeocoding(tweet);
  if (coordinates) {
    addCountryCode();
  }
  return coordinates;

  function addCountryCode() {
    var countryCode = '??';
    if (tweet.place && tweet.place.country_code) {
      countryCode = tweet.place.country_code;
    }
    coordinates.countryCode = countryCode;
  }
}

module.exports = createTwitterConnection;
