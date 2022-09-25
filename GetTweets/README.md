Azure function documentation: https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-typescript

## Run locally

## Twitter API

https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens
https://developer.twitter.com/en/docs/tutorials/step-by-step-guide-to-making-your-first-request-to-the-twitter-api-v2

BEARER_TOKEN_FROM_DASHBOARD=x
ACCESS_TOKEN=$BEARER_TOKEN_FROM_DASHBOARD

SCREENNAME=y
curl "https://api.twitter.com/2/users/by/username/$SCREENNAME" -H "Authorization: Bearer $ACCESS_TOKEN"

USER_ID=z
curl "https://api.twitter.com/2/users/$USER_ID/tweets?max_results=5" -H "Authorization: Bearer $ACCESS_TOKEN"
