import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {

const userId = event.requestContext?.authorizer?.claims?.sub;

    // USER ID IS REQUIRED
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized - please login" }),
      };
    }

    const businessId = event.pathParameters?.id;

    // GETTING EXISTING BUSINESS
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "business",
        Key: { businessId },
      })
    );

    // NO BUSINESS FOUND
    if (!existing.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Business not found" }),
      };
    }

    // USER ID MUST MATCH
    if (existing.Item.userId !== userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized - you did not create this business" }),
      };
    }

    // SAFE DELETE
    await dynamo.send(
      new DeleteCommand({
        TableName: "business",
        Key: { businessId },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Deleted successfully" }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};