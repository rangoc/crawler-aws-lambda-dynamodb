const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;
const AUTH_TYPE = require('aws-appsync-auth-link/lib/auth-link').AUTH_TYPE;
const parse = require('aws-event-parser').parse;

require('es6-promise').polyfill();
require('isomorphic-fetch');


module.exports.handler = async function (event, context) {
  console.log(event);
}


