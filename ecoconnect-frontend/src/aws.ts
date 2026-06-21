import { Amplify } from "aws-amplify"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_gw9GLLiYR",
      userPoolClientId: "5p8opve22g26uq10s2rijcl4e1",
    },
  },
})