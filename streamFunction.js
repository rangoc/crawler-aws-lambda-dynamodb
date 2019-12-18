import { gql } from 'graphql-tag'

module.exports.handler =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    
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

  await graphqlClient.mutate({ mutation });
  return {
    statusCode: 200,
    body: 'Mutation success',
  }
}