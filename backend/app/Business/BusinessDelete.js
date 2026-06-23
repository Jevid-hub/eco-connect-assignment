import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
}
export const handler = async (event) => {
  try {
    const admin = event.requestContext?.authorizer?.claims?.sub;

    // ADMIN IS REQUIRED
    if (!admin) {
      return {
        statusCode:
          headers,
        body: JSON.stringify({ error: "Invalid Admin" }),
      };
    }

    const BusinessId = event.pathParameters?.BusinessId;

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
        headers,
        body: JSON.stringify({ error: "No Business Found" }),
      };
    }

    // USER ID MUST MATCH
    if (existing.Item.admin !== admin) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Permission Denied" }),
      };
    }

    // SAFE DELETE
    await dynamo.send(
      new DeleteCommand({
        TableName: "Business",
        Key: { BusinessId },
      })
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Deleted successfully" }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};