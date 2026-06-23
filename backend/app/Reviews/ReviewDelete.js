import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
};

export const handler = async (event) => {
  const admin = event.requestContext?.authorizer?.claims?.sub;
  // ADMIN IS REQUIRED
  if (!admin) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Invalid Admin " }),
    };
  }
  try {
    const BusinessId = event.pathParameters?.BusinessId;
    const ReviewId = event.pathParameters?.ReviewId;
    // BOTH THE BUSINESS ID AND REVIEW ID IS REQUIRED IN THIS CASE
    if (!BusinessId || !ReviewId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Business id and review id cannot be empty" }),
      };
    }
    // FETCHING REVIEWS IT EXISTED
    const review = await dynamo.send(
      new GetCommand({
        TableName: "Reviews",
        Key: { BusinessId, ReviewId },
      })
    );
    //  NO REVIEW FOUND
    if (!review.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No Review Found" }),
      };
    }
    // CHECKING PERMISSION
    if (review.Item.admin !== admin) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid User Permission" }),
      };
    }
    // SAFE DELETE
    await dynamo.send(
      new DeleteCommand({
        TableName: "Reviews",
        Key: { BusinessId, ReviewId },
      })
    );
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Review deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};