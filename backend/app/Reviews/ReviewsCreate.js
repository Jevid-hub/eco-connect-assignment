import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const userId = event.requestContext?.authorizer?.claims?.sub;

  // USER ID IS REQUIRED
  if (!userId) {
    return {
      statusCode: 401,

      body: JSON.stringify({ error: "Invalid User" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const {  comment } = body;
    const BusinessId = event.pathParameters?.id;
    const userId = event.requestContext?.authorizer?.claims?.sub;
    const userEmail = event.requestContext?.authorizer?.claims?.email;
    
    const review = {
      reviewId: Date.now().toString(),
      BusinessId,  
      userId,
      userEmail,  
      comment,
    };

    await dynamo.send(
      new PutCommand({
        TableName: "Reviews",
        Item: review,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(review),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};