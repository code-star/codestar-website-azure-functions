import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import got from "got";

interface IPlaylistResponse {
  items: Array<{
    contentDetails: {
      videoId: string;
      videoPublishedAt: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: Array<object>;
    };
  }>;
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetYoutubePlaylist function processed a request.");
  const { YOUTUBE_API_KEY, YOUTUBE_PLAYLIST_ID } = process.env;
  const countRaw = Number(req.query.count || 0);
  const count = countRaw > 0 && countRaw < 51 ? countRaw : 50;
  const YOUTUBE_PLAYLIST_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&playlistId=${YOUTUBE_PLAYLIST_ID}&maxResults=${count}`;

  try {
    const playlist = await got<IPlaylistResponse>(YOUTUBE_PLAYLIST_URL, {
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
