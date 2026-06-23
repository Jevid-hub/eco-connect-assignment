import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);



export const handler = async (event) => {
  try {
  
    const BusinessId = event.pathParameters?.id;
// BUSINESS ID IS REQUIRED
    if (!BusinessId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing BusinessId in path" }),
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
        body: JSON.stringify({ error: "No Business found" }),
      };
    }

    // RETURNED BOTH THE REVEWS AND BUSINESS
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