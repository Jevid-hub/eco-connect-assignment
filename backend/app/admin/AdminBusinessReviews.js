import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
};

export const handler = async (event) => {
  const admin = event.requestContext?.authorizer?.claims?.sub;

  // ADMIN IS REQUIRED
  if (!admin) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: "Invalid Admin", }),
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
      (item) => item.admin === admin
    );
    const userReviews = (reviewsData.Items || []).filter(
      (item) => item.admin === admin
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        businesses: userBusinesses,
        reviews: userReviews,
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