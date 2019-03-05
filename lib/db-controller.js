const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});


module.exports.get = (user, cb) => {
  dynamo.get({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: user
      }
    }, cb);
}

module.exports.save = (user, cb) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: user
  }

  dynamo.put(params, cb);
}
