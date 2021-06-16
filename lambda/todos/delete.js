const { DynamoDB } = require("aws-sdk");

const dynamoDB = new DynamoDB.DocumentClient();

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ReturnValues: "ALL_OLD",
  };

  dynamoDB.delete(params, (error, result) => {
    if (error) {
      console.error(error);

      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todo item.",
      });
      return;
    }

    console.log(`result: ${result}`);

    if (result?.Attributes) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result.Attributes),
      });
      return;
    }

    console.warn(`Item not found: id: ${params.Key.id}`);

    callback(null, {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "Item not found.",
    });
  });
};
