import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);



export const handler = async (event) => {
  try {
  
    const businessId = event.pathParameters?.id;
// BUSINESS ID IS REQUIRED
    if (!businessId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing businessId in path" }),
      };
    }

    // FETCHING BOTH BUSINESS AND REVIEWS CONCURRENTLY
    const [businessResult, reviewsResult] = await Promise.all([
      dynamo.send(
        new GetCommand({
          TableName: "business",
          Key: { businessId },
        })
      ),
      dynamo.send(
        new QueryCommand({
          TableName: "reviews",
          KeyConditionExpression: "businessId = :id",
          ExpressionAttributeValues: { ":id": businessId },
        })
      ),
    ]);

    // NO BUSINESS FOUND
    if (!businessResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Business not found" }),
      };
    }

    // return the business along with its reviews in one response
    return {
      statusCode: 200,
      body: JSON.stringify({
        business: businessResult.Item,
        reviews: reviewsResult.Items || [],
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};