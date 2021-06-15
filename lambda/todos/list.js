const { DynamoDB } = require("aws-sdk");

const dynamoDB = new DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

module.exports.list = (event, context, callback) => {
  dynamoDB.scan(params, (error, result) => {
    if (error) {
      console.error(error);

      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todos.",
      });
      return;
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    });
  });
};
