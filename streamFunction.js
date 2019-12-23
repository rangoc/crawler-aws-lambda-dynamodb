const gql  = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;
require('es6-promise').polyfill();
require('isomorphic-fetch');

const client = new AWSAppSyncClient({
  url: process.env.url,
  region: process.env.region,
  auth: {
    type: process.env.authType,
    apiKey: process.env.apiKey
  },
  disableOffline: true
});
module.exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    const {employer, location, datePosted, title, url } = event;
  
    const mutation = gql`
    mutation createJob {
      createJob(input: { 
        
        employer: "${employer}",
        location: "${location}",
        datePosted: "${datePosted}",
        title: "${title}",
        url: "${url}"
      }) {
          id
          employer
          location
          datePosted
          title
          url
      }
    }
  `;
await client.mutate({ mutation, fetchPolicy: 'network-only' });
  return {
    statusCode: 200,
    body: 'Mutation success',
  }
}