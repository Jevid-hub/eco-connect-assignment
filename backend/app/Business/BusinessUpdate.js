import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    
const userId = event.requestContext?.authorizer?.claims?.sub;

    //USER ID MUST REQUIRED
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized - please login" }),
      };
    }

    const businessId = event.pathParameters?.id;

    // FETCHING PARTICULAR BUSINESS
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

    // USER AND PERMISSION CHECK
    if (existing.Item.userId !== userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized - you did not create this business" }),
      };
    }

    const body = JSON.parse(event.body);

    // SAFE UPDATE
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "business",
        Key: { businessId },
        UpdateExpression: "set businessName = :name, category = :category, description = :description",
        ExpressionAttributeValues: {
          ":name": body.name,
          ":category": body.category,
          ":description": body.description,
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