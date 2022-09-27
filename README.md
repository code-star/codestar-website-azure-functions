<img align=center src=https://cloud.githubusercontent.com/assets/4116708/12473911/e67fdd44-c016-11e5-9c21-5714e07549fe.png width=450 />

_Passionate programmers standing to make a change_

---

# Codestar blog Azure functions

See individual README files in each Azure function directory for more information

This repo replaces the AWS Lamdbas in [codestar-website-functions](https://github.com/code-star/codestar-website-functions)

**Contents:**

1. [Requirements](#requirements)
1. [Developing](#developing)
1. [Deploying](#deploying)

## Requirements

Uses Node 16 (latest Node version available on Azure).

When [nvm](https://github.com/creationix/nvm) is installed, this Node version can be activated by running `nvm use` in the root of the project.

## Developing

Azure function documentation: https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-typescript

- Make sure this is installed: npm install -g azure-functions-core-tools
- configure a .env file in the root of the project with values for:

```
TWITTER_ACCESS_TOKEN=bearer_token_from_twitter_dashboard
TWITTER_USER_NAME=some_twitter_handle_without_@
YOUTUBE_API_KEY=a_valid_youtube_api_key
YOUTUBE_PLAYLIST_ID=some_playlist_id
```

and

- in VS Code run with F5

or

- npm i
- npm start (manually restart on each change)
- in VS Code, in the Azure toolbar under Workspace > Functions > GetTweets, right click and "execute function now"

# Deploying

- set envars in Azure Function App console under > configuration > Application settings, add:

```
TWITTER_ACCESS_TOKEN=bearer_token_from_twitter_dashboard
TWITTER_USER_NAME=some_twitter_handle_without_@
YOUTUBE_API_KEY=a_valid_youtube_api_key
YOUTUBE_PLAYLIST_ID=some_playlist_id
```

- CORS: in Azure Function App console under > API > CORS
  - Request credentials can be turned OFF
  - Add allowed origins: https://code-star.github.io
- Slots (stages/test environment): in Azure Function App console under > Deployment > Deployment slots
  - add a stage: codestar-website-api-test

### Deploy to Test Slot:

- in VS Code, in the Azure toolbar under Resources, expand codestar-website-api > Slots > test and right-click. Click "deploy to slot"

### Deploy to Prod Slot:

- in VS Code, in the Azure toolbar under Resources, expand codestar-website-api > Slots > test and right-click. Click "Swap slot..."
- select the production slot

or:

- in VS Code, in the Azure toolbar under Workspace > click the "deploy" icon (cloud with up arrow), select the correct Resource Group and the codestar-website-api Function App. Allow overwriting the existing deployment.

## TODO

- Add unit tests
- TODO https://github.com/Azure/functions-action
- TODO API Management: in Azure Function App console under > API > API Management
  - create or use: codestar-website-api-apim
    - organization name: Codestar
    - admin email: ...
    - Pricing tier: Developer
  - create new:
    - import functions, click "Link API"
    - Select all the Azure Functions to add (if nothing is shown, wait at least 1 hour after a new API was created)
    - Create from Function App: continue with defaults (everything set to codestar-website-api, baseUrl: https://codestar-website-api-apim.azure-api.net/codestar-website-api )
  - Navigate in Azure Function App console under > API > API Management 
    - Modify each endpoint to have the "Get" part of the url implicitely. E.g. for the GetPublications operation, click "GET GetPublications" and edit "Frontend". Set URL to "/publications"
    - On the "Settings" tab, disable "subscription required" 
    - Test with https://codestar-website-api-apim.azure-api.net/codestar-website-api/publications
- TODO cache responses on all function endpoints per day to prevent API overruns?
- TODO add WAF with https://azure.microsoft.com/en-us/products/application-gateway/#features