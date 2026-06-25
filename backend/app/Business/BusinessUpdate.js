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
  try {

    const admin = event.requestContext?.authorizer?.claims?.sub;

    //ADMIN MUST REQUIRED
    if (!admin) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid Admin" }),
      };
    }

    const BusinessId = event.pathParameters?.BusinessId;

    // FETCHING PARTICULAR BUSINESS
    const business = await dynamo.send(
      new GetCommand({
        TableName: "Business",
        Key: { BusinessId },
      })
    );

    // NO BUSINESS FOUND
    if (!business.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Business not found" }),
      };
    }

    // USER AND PERMISSION CHECK
    if (business.Item.admin !== admin) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invali Admin permission" }),
      };
    }

    const body = JSON.parse(event.body);

    // SAFE UPDATE
    const result = await dynamo.send(
      new UpdateCommand({
        TableName: "Business",
        Key: { BusinessId },
        UpdateExpression: "set businessName = :title, summary  = :summary",
        ExpressionAttributeValues: {
          ":title": body.title,
          ":summary": body.summary,
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