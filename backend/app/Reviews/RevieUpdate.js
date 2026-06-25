import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

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
      body: JSON.stringify({ error: "Inalid Admin" }),
    };
  }

  try {
    const ReviewId = event.pathParameters?.ReviewId;
    const BusinessId = event.pathParameters?.BusinessId;
    const body = JSON.parse(event.body);
    const { message } = body;

    // FETCH THE REVIEWS 
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "Reviews",
        Key: { BusinessId, ReviewId },
      })
    );

    // NO REVIEW FOUND
    if (!existing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No Reviews found" }),
      };
    }

    // PERMISSION CHECKing 
    if (existing.Item.admin !== admin) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid Admin perimssion" }),
      };
    }

    // SAFE UPDATE
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "Reviews",
        Key: { BusinessId, ReviewId },
        UpdateExpression: "set #c = :message",
        ExpressionAttributeNames: {
          "#c": "message",
        },
        ExpressionAttributeValues: {
          ":message": message,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Attributes),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};