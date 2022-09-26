import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import got from "got";



const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetYoutubePlaylist function processed a request.");
  const { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } = process.env;
  const YOUTUBE_PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&playlistId=${YOUTUBE_PLAYLIST_ID}&maxResults=50`;

  const name = req.query.name || (req.body && req.body.name);
  const responseMessage = name
    ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  try {
    // const userId = await getUserId();
    // if (!userId) {
    //   throw Error(`no user id found for ${TWITTER_USER_NAME}`);
    // }
    const playlist = await got<any>(YOUTUBE_PLAYLIST_URL, {
      responseType: "json",
    });
    context.log(playlist.body);
    // context.log(playlist.body.items.slice(0, 3));
    context.res = {
      body: `playlist`,
    };
    return;
  } catch (err) {
    context.log("error: " + err);
    context.res = {
      status: 500,
      body: "Invalid downstream response",
    };
  }

  //   context.res = {
  //     // status: 200, /* Defaults to 200 */
  //     body: responseMessage,
  //   };
};

export default httpTrigger;
