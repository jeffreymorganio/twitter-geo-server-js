# twitter-geo-server-js

The **Twitter Geo Server** is a Node.js application that serves geocoded data derived from tweets retrieved from the [Twitter streaming API](https://dev.twitter.com/streaming/overview "Learn more about the Streaming API at Twitter") to multiple clients over [web sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API "View the Mozilla web socket API documentation"). Each item of geocoded data contains the point of longitude and latitude at which a geocoded tweet was authored and the two-letter code of the country containing the point.

The default setting returns geocoded data from anywhere in the world. To receive geocoded data from a specific geographic area, you can supply a longitude and latitude bounding box as a command-line parameter.

This server was developed to drive the [D3 Twitter Geo Stream](https://github.com/UsabilityEtc/d3-twitter-geo-stream) visualization, but it also provides a source of naturally-occuring geocoded data that is useful for a variety of applications.

## Geocoded JSON Data

The Twitter Geo Server returns a stringified JSON object for each geocoded tweet in the following format:

```javascript
{
  "latitude": 39.012764,
  "longitude": -82.0368729,
  "countryCode": "US"
}
```

The value of the `countryCode` key is the <a href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2" rel="external" title="View Wikipedia's list of ISO 3166-1-alpha-2 two-letter country codes">ISO 3166-1-alpha-2</a> country code that contains the point of longitude and latitude at which the tweet was authored, as determined by Twitter.

## Requirements

To run the Twitter Geo Server, you will need to [install Node.js](https://docs.npmjs.com/getting-started/installing-node "Learn how to install Node.js at npmjs.org"). After cloning the `twitter-geo-server-js` repository, run `npm install` to download the Node.js modules on which the Twitter Geo Server application depends.

## Twitter Credentials

To allow the Twitter Geo Server to make an authenticated connection to the Twitter Streaming API, you need to supply your own Twitter application credentials. Twitter application credentials are a pair of consumer key and secret and a pair of access token key and secret, which you can set up using your Twitter account on the [Twitter applications page](http://apps.twitter.com) using [these instructions](https://dev.twitter.com/oauth/overview/application-owner-access-tokens "Learn how to generate application credentials at TWitter").

When you have created the credentials for your Twitter application, copy and paste the corresponding values into the `twitter-credentials.js` file:

```javascript
/*
 * You need to supply your own values for the following keys.
 * Get yours at http://apps.twitter.com
 */
module.exports = {
  consumer_key: 'YOUR CONSUMER KEY',
  consumer_secret: 'YOUR CONSUMER SECRET',
  access_token_key: 'YOUR ACCESS TOKEN KEY',
  access_token_secret: 'YOUR ACCESS TOKEN SECRET'
};
```

## Running the Server

To run the Twitter Geo Server with the default parameters, invoke the start script in the `package.json` file:

```
npm start
```

or run the `server.js` application with Node.js:

```
node server.js
```

This will run the server on port 5000 and return geocoded data from anywhere in the world. You can change the default port and geographical area with command-line parameters.

## Command-Line Parameters

`-p` `--port`

<p style="margin-left: 1.5em">Specifies the port on which the server will run. The default is 5000.</p>

`-b` `--boundingbox`

<p style="margin-left: 1.5em">Specifies the bounding box around the geographical area from which geocoded data will be returned. This value is a string that contains a pair of longitude and latitude pairs, with the southwest corner of the bounding box coming first, as described in the Twitter API documentation for the  [locations streaming API parameter](https://dev.twitter.com/streaming/overview/request-parameters#locations "Learn more about the locations parameter of the streaming API at Twitter"). The default is ["-180,-90,180,90"](https://gist.github.com/UsabilityEtc/5f67d031c4e61a11843a "View the world bounding box on a map"), which encloses the world.</p>

For example, the following command starts the Twitter Geo Server on port 5025 and limits the geocoded data with a custom [bounding box around the UK](https://gist.github.com/UsabilityEtc/6d2059bd4f0181a98d76 "View the UK bounding box on a map"):

```
node server.js -p=5025 --boundingbox="-10.8544921875,49.92293545449574,2.021484375,58.77959115030064"
```

## Connecting to the Server

The following JavaScript creates a web socket to receive geocoded data from an instance of the Twitter Geo Server running locally on port 5000. After parsing the stringified JSON object stored in `event.data`, the resulting `geoData` JSON object is logged to the console.

```javascript
var webSocket = new WebSocket('ws://localhost:5000');
webSocket.onmessage = function(event) {
  var geoData = JSON.parse(event.data);
  console.log(geoData);
};
```

The [D3 Twitter Geo Stream](https://github.com/UsabilityEtc/d3-twitter-geo-stream) is an example client that connects to the Twitter Geo Server and visualizes the geocoded data with a D3 map and a D3 bar chart.

## Custom Bounding Boxes

The default bounding box captures all the geocoded tweets in the world with the following bounding box:

```json
"-180,-90,180,90"
```

To limit the geocoded tweets returned by the server to the UK, for example, use the following bounding box:

```json
"-10.8544921875,49.92293545449574,2.021484375,58.77959115030064"
```

Note that enclosing a geographic area with a bounding box might include geocoded data from neighboring areas. For example, the [UK bounding box](https://gist.github.com/UsabilityEtc/6d2059bd4f0181a98d76 "View the UK bounding box on a map") shown above will also include geocoded data derived from tweets authored in Ireland and a small region of France.

To filter out geocoded data at the country level, examine the value of the `countryCode` key of each geocoded datum after it is returned by the server. For example, here's the JavaScript to exclude all tweets not authored in the UK:

```javascript
if (geoData.countryCode === 'GB') {
  // Do something with geocoded data from the UK
}
```
