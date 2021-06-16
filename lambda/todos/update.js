const { DynamoDB } = require("aws-sdk");

const dynamoDB = new DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const data = event.body;
  console.log(`input: ${data?.text} ${data?.checked}`);

  // validation
  // data is not exist || data.text is not string || data.checked is not boolean
  if (typeof data?.text !== "string" && typeof data.checked !== "boolean") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the todo item.",
    });
    return;
  }

  const timestamp = new Date().getTime();

  const expressionAttributeNames = {};
  const expressionAttributeValues = {
    ":updatedAt": timestamp,
  };

  const updateExpressionArray = ["updatedAt = :updatedAt"];
  if (data.text) {
    expressionAttributeNames["#todo_text"] = "text";
    expressionAttributeValues[":text"] = data.text;
    updateExpressionArray.push("#todo_text = :text");
  }
  if (data.checked != null) {
    expressionAttributeValues[":checked"] = data.checked;
    updateExpressionArray.push("checked = :checked");
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: expressionAttributeValues,
    UpdateExpression: `SET ${updateExpressionArray.join(",")}`,
    ReturnValues: "ALL_NEW",
  };

  // add ExpressionAttributeNames when it is not empty
  if (Object.keys(expressionAttributeNames).length > 0) {
    params.ExpressionAttributeNames = expressionAttributeNames;
  }

  dynamoDB.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todo item.",
      });
      return;
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    });
  });
};
