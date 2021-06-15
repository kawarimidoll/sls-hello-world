const uuid = require("uuid");
const { DynamoDB } = require("aws-sdk");

const dynamoDB = new DynamoDB.DocumentClient();
const errMsg = "Couldn't create the todo item.";

module.exports.create = (event, context, callback) => {
  console.log(`input: ${event.body}`);

  const data = event.body;

  if (typeof data?.text !== "string") {
    console.error("Validation failed");
    callback(new Error(errMsg));
    return;
  }

  const timestamp = new Date().getTime();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v4(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamoDB.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error(errMsg));
      return;
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    });
  });
};
