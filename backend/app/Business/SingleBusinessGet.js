import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
};

export const handler = async (event) => {
  try {
    const BusinessId = event.pathParameters?.BusinessId;
    // BUSINESS ID IS REQUIRED
    if (!BusinessId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Business Id is reuqired" }),
      };
    }
    // FETCHING BOTH BUSINESS AND REVIEWS CONCURRENTLY
    const [businessResult, reviewsResult] = await Promise.all([
      dynamo.send(
        new GetCommand({
          TableName: "Business",
          Key: { BusinessId },
        })
      ),
      dynamo.send(
        new QueryCommand({
          TableName: "Reviews",
          KeyConditionExpression: "BusinessId = :id",
          ExpressionAttributeValues: { ":id": BusinessId },
        })
      ),
    ]);
    // NO BUSINESS FOUND
    if (!businessResult.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "No Business found" }),
      };
    }
    // RETURNED BOTH THE REVEWS AND BUSINESS
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        business: businessResult.Item,
        reviews: reviewsResult.Items || [],
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};