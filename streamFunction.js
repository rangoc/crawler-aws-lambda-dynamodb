const gql  = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;

require('es6-promise').polyfill();
require('isomorphic-fetch');
require('dotenv').config();

module.exports.handler =  async function(event, context) {
    //const {employer, location, datePosted, title, url } = event;
    const client = new AWSAppSyncClient({
      url: process.env.url,
      region: process.env.region,
      auth: {
        type: process.env.apiType,
        apiKey: process.env.apiKey
      },
      disableOffline: true
    });
    const query = gql`
      query listJobs {
        listJobs{
          items {
            id title employer datePosted location url
          }
        }
      }
    `;
    client.hydrated().then(function (client) {
      //Now run a query
      client.query({ query: query });
      client.query({ query: query, fetchPolicy: 'network-only' })   //Uncomment for AWS Lambda
          .then(function logData(data) {
              console.log('results of query: ', data);
          })
          .catch(console.error);
    });
    /*const mutation = gql`
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
await client.mutate({ mutation });
  return {
    statusCode: 200,
    body: 'Mutation success',
  }*/
}