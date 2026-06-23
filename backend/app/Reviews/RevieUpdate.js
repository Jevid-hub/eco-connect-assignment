import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  
  const userId = event.requestContext?.authorizer?.claims?.sub;

  // USER ID IS REQUIRED
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Inalid User" }),
    };
  }

  try {
    const ReviewId = event.pathParameters?.reviewid;
    const body = JSON.parse(event.body);
    const { BusinessId, comment } = body;

    // FETCH THE REVIEWS 
    const existing = await dynamo.send(
      new GetCommand({
        TableName: "Reviews",
        Key: {BusinessId, ReviewId },
      })
    );

    // NO REVIEW FOUND
    if (!existing.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No Reviews found" }),
      };
    }

    // PERMISSION CHECKing 
    if (existing.Item.userId !== userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid User perimssion" }),
      };
    }

    // SAFE UPDATE
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "Reviews",
        Key: { BusinessId, ReviewId },  
        UpdateExpression: "set #c = :comment",
        ExpressionAttributeNames: {
          "#c": "comment",  
        },
        ExpressionAttributeValues: {
          ":comment": comment,
        },
        ReturnValues: "ALL_NEW",
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};