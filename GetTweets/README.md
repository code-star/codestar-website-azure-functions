Azure function documentation: https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-typescript

## Run locally

* Make sure this is installed: npm install -g azure-functions-core-tools
- npm i
- npm start (manually restart on each change)
- in VS Code, in the Azure toolbar under Workspace > Functions > GetTweets, right click and "execute function now"

# Deploy

- set envars in Azure Function App console under > configuration > Application settings
    - Add: TWITTER_ACCESS_TOKEN = bearer token from Twitter developer dashboard
    - Add: TWITTER_USER_NAME = some twitter handle, without the @
- in VS Code, in the Azure toolbar under Workspace > click the "deploy" icon (cloud with up arrow)
- CORS: in Azure Function App console under > API > CORS
    - 


## Twitter API

https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens
https://developer.twitter.com/en/docs/tutorials/step-by-step-guide-to-making-your-first-request-to-the-twitter-api-v2

BEARER_TOKEN_FROM_DASHBOARD=x
ACCESS_TOKEN=$BEARER_TOKEN_FROM_DASHBOARD

SCREENNAME=y
curl "https://api.twitter.com/2/users/by/username/$SCREENNAME" -H "Authorization: Bearer $ACCESS_TOKEN"

USER_ID=z
curl "https://api.twitter.com/2/users/$USER_ID/tweets?max_results=5" -H "Authorization: Bearer $ACCESS_TOKEN"
