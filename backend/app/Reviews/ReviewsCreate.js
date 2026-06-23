import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
}
export const handler = async (event) => {
  const admin = event.requestContext?.authorizer?.claims?.sub;

  // ADMIN IS REQUIRED
  if (!admin) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Invalid admin" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { message } = body;
    const BusinessId = event.pathParameters?.BusinessId;
    const adminEmail = event.requestContext?.authorizer?.claims?.email;

    const review = {
      ReviewId: crypto.randomUUID(),
      BusinessId,
      admin,
      adminEmail,
      message,
    };

    await dynamo.send(
      new PutCommand({
        TableName: "Reviews",
        Item: review,
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(review),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
