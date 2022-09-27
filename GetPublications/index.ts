import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import got from "got";
import { XMLParser } from "fast-xml-parser";

const GET_PUBLICATIONS_URL = "https://medium.com/feed/codestar-blog";

interface IMediumRSSResponse {
  rss: {
    channel: {
      item: Array<{
        guid: string;
        title: string;
        pubDate: string;
        link: string;
        "dc:creator": string;
        "content:encoded": string;
      }>;
    };
  };
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetPublications function processed a request.");

  try {
    const response = await got<string>(GET_PUBLICATIONS_URL);
    const parser = new XMLParser();
    const jsonObj: IMediumRSSResponse = parser.parse(response.body);
    const publications = jsonObj.rss.channel.item;
    const simplePosts = publications.map((publication) => ({
      id: publication.guid,
      title: publication.title,
      author: publication["dc:creator"],
      latestPublishedAt: publication.pubDate,
      uniqueSlug: publication.link,
      paragraphs: publication["content:encoded"],
    }));
    context.res = {
      body: simplePosts,
    };
  } catch (err) {
    context.log("error: " + err);
    context.res = {
      status: 500,
      body: "Invalid downstream response",
    };
  }
};

export default httpTrigger;
