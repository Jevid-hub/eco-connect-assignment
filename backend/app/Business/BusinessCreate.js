import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
};

export const handler = async (event) => {
  try {
    const admin = event.requestContext?.authorizer?.claims?.sub;
    // ADMIN MUST REQUIRED
    if (!admin) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid Admin" }),
      };
    }
    const body = JSON.parse(event.body);
    const newBusiness = {
      BusinessId: crypto.randomUUID(),
      title: body.title,
      summary: body.summary,
      admin,
    };
    await dynamo.send(new PutCommand({ TableName: "Business", Item: newBusiness }));
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(newBusiness),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};