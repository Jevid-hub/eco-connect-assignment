import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export const handler = async (event) => {
  const userId = event.requestContext?.authorizer?.claims?.sub;

  // USER IS REQUIRED
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid User", }),
    };
  }

  try {
    // FETCHING THE BUSINESS AND PREVIEWS CONCURRENTLY 
    const [businessData, reviewsData] = await Promise.all([
      docClient.send(new ScanCommand({ TableName: "Business" })),
      docClient.send(new ScanCommand({ TableName: "Reviews" })),
    ]);

    // FILTERING USER BASED BUSINESS AND REVIEWS
    const userBusinesses = (businessData.Items || []).filter(
      (item) => item.userId === userId
    );
    const userReviews = (reviewsData.Items || []).filter(
      (item) => item.userId === userId
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        businesses: userBusinesses,
        reviews: userReviews,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};