function parseCommandLineArguments(commandLineArguments) {
  var parseArgs = require('minimist');
  var parsedCommandLineArguments = parseArgs(commandLineArguments, commandLineParserOptions());
  return {
    port: parsedCommandLineArguments.port,
    boundingBox: parsedCommandLineArguments.boundingbox,
    twitterCredentialsFilename: parsedCommandLineArguments.credentials
  };
}

function commandLineParserOptions() {
  var buildOptions = require('minimist-options');
  var options = {
    port: {
      alias: 'p',
      default: defaultPort()
    },
    boundingbox: {
      type: 'string',
      alias: 'b',
      default: defaultBoundingBox()
    },
    credentials: {
      type: 'string',
      alias: 'c',
      default: defaultTwitterCredentialsFilename()
    }
  };
  return buildOptions(options);
}

function defaultPort() {
  return 5000;
}

function defaultBoundingBox() {
  return worldBoundingBox();
}

function worldBoundingBox() {
  return '-180,-90,180,90';
}

function defaultTwitterCredentialsFilename() {
  return 'twitter-credentials.js';
}

module.exports = parseCommandLineArguments;
