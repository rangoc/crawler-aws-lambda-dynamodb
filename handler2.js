module.exports.streamReader =  async function(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    return context.logStreamName
  }