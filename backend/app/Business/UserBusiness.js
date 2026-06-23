import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const userId = event.requestContext?.authorizer?.claims?.sub;

    // USER ID IS REQUIRED
    if (!userId) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: "Unauthorized - please login", redirect: "/login" }),
        };
    }

    try {
        // FETCHING THE BUSINESS
        const data = await docClient.send(
            new ScanCommand({ TableName: "business" })
        );

        // FINDING BUSINESS ASSOCIATED WITH USER
        const userBusinesses = (data.Items || []).filter(
            (item) => item.userId === userId
        );

        return {
            statusCode: 200,
            body: JSON.stringify(userBusinesses),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};