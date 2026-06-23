import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

const userId = event.requestContext?.authorizer?.claims?.sub;

  // USER ID IS REQUIRED
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid User " }),
    };
  }

  try {
    const BusinessId = event.pathParameters?.id;
    const ReviewId = event.pathParameters?.reviewid;

// BOTH THE BUSINESS ID AND REVIEW ID IS REQUIRED IN THIS CASE
    if (!BusinessId || !ReviewId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Business id and review id cannot be empty" }),
      };
    }

    // FETCHING REVIEWS IT EXISTED
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "Reviews",
        Key: { BusinessId, ReviewId },
      })
    );

    //  NO REVIEW FOUND
    if (!existing.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No Review Found" }),
      };
    }

    // CHECKING PERMISSION
    if (existing.Item.userId !== userId) {
      return {
        statusCode: 401,

        body: JSON.stringify({ error: "Invalid User Permission" }),
      };
    }

    // SAFE DELETE
    await dynamo.send(
      new DeleteCommand({
        TableName: "Reviews",
        Key: { businesId: BusinessId, ReviewId },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Review deleted successfully" }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};