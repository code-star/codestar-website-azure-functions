import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import got from "got";

const { TWITTER_ACCESS_TOKEN, TWITTER_USER_NAME } = process.env;

const TWITTER_API_USERS_URL = "https://api.twitter.com/2/users/by/username/";

const getTwitterApiTweetsUrl = (userId: string, count: number) =>
  `https://api.twitter.com/2/users/${userId}/tweets?max_results=${count}`;

const getUserId = async (): Promise<string | null> => {
  try {
    const response = await got<{
      data: { id: string; name: string; username: string };
    }>(`${TWITTER_API_USERS_URL}${TWITTER_USER_NAME}`, {
      responseType: "json",
      headers: {
        Authorization: `Bearer ${TWITTER_ACCESS_TOKEN}`,
      },
    });
    const { id } = response.body.data;
    return id;
  } catch (err) {
    return null;
  }
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetTweets function processed a request.");
  const countRaw = Number(req.query.count || 0);
  const count = countRaw > 0 && countRaw < 10 ? countRaw : 5;

  try {
    const userId = await getUserId();
    if (!userId) {
      throw Error(`no user id found for ${TWITTER_USER_NAME}`);
    }
    const tweets = await got<{ data: { id: string; text: string }[] }>(
      getTwitterApiTweetsUrl(userId, count),
      {
        responseType: "json",
        headers: {
          Authorization: `Bearer ${TWITTER_ACCESS_TOKEN}`,
        },
      }
    );
    context.res = {
      body: tweets.body.data,
    };
    return;
  } catch (err) {
    context.log("error: " + err);
    context.res = {
      status: 500,
      body: "Invalid downstream response",
    };
  }
};

export default httpTrigger;
