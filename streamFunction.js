const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;
const AUTH_TYPE = require('aws-appsync-auth-link/lib/auth-link').AUTH_TYPE;
const AWS = require('aws-sdk');

require('es6-promise').polyfill();
require('isomorphic-fetch');
require('dotenv').config();

module.exports.handler = async function (event, context) {

  try {
    const appSyncClient = new AWSAppSyncClient(
      {
        url: process.env.URL,
        region: process.env.REGION,
        auth: {
          type: AUTH_TYPE.API_KEY,
          apiKey: process.env.API_KEY
        },
        disableOffline: true
      },
      {
        defaultOptions: {
          query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
        },
      }
    );
   let records = event.Records.filter(r => r.eventName === 'INSERT');
    for(let record of records) {
      const { id, employer, title, datePosted, location, url } = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
      // for logs ->>
      // const data = {id, employer, title, datePosted,location, url};
      // console.log('indexing record: %j', data);
      const mutation = gql`
      mutation createJob {
        createJob(input: { 
          employer: "${employer}",
          sourceId: "${id}",
          location: "${location}",
          datePosted: "${datePosted}",
          title: "${title}",
          url: "${url}"
      }) {
          id
          sourceId
          employer
          location
          datePosted
          title
          url
         }
      }
     `;
      await appSyncClient.mutate({ mutation });
    };
    
    // the following code does the queries:

    /*const query = await gql`
      query listJobs {
        listJobs{
          items {
            id title employer datePosted location url
          }
        }
      }
    `;
    await appSyncClient.hydrated();
    const { data: { listJobs: { items } } } = await appSyncClient.query({ query });
    for(let element of items) {
      const { id, employer, title, datePosted, location, url } = element;
      const data = {id, employer, title, datePosted,location, url};
      console.log('indexing object %j', data);
    };*/
  } catch (error) {
      return context.fail(error);
  }
  return context.succeed("success");
}  