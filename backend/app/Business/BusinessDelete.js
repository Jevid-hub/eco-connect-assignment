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
        body: JSON.stringify({ error: "Invalid User" }),
      };
    }

    const BusinessId = event.pathParameters?.id;

    // GETTING EXISTING BUSINESS
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "Business",
        Key: { BusinessId },
      })
    );

    // NO BUSINESS FOUND
    if (!existing.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No Business Found" }),
      };
    }

    // USER ID MUST MATCH
    if (existing.Item.userId !== userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Permission Denied" }),
      };
    }

    // SAFE DELETE
    await dynamo.send(
      new DeleteCommand({
        TableName: "Business",
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