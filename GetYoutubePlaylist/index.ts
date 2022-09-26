import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import got from "got";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetYoutubePlaylist function processed a request.");
  const { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } = process.env;
  const YOUTUBE_PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&playlistId=${YOUTUBE_PLAYLIST_ID}&maxResults=50`;

  //   const name = req.query.name || (req.body && req.body.name);
  //   const responseMessage = name
  //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
  //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  try {
    const playlist = await got<any>(YOUTUBE_PLAYLIST_URL, {
      responseType: "json",
    });

    const items = playlist.body.items.map((item) => ({
      id: item.contentDetails.videoId,
      publishedAt: new Date(item.contentDetails.videoPublishedAt),
      title: item.snippet.title,
      description: item.snippet.description
        ? item.snippet.description.split("\n")
        : [],
      thumbnails: item.snippet.thumbnails,
    }));

    // context.log(playlist.body.items);

    context.res = {
      body: items,
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
