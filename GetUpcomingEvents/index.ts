import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import got from "got";

type MeetupResponse = Array<{
  name: string;
  time: string;
  link: string;
  description: string;
  featured_photo: string;
}>;

// Meetup API test console: https://secure.meetup.com/meetup_api/console/?path=/:urlname/events
const GET_UPCOMING_EVENTS_URL =
  "https://api.meetup.com/Codestar-Night/events?&sign=true&photo-host=public&page=3&fields=featured_photo&desc=false";

// No API key needed, only exists as a CORS proxy and mapping
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetUpcomingEvents function processed a request.");

  try {
    const response = await got<MeetupResponse>(GET_UPCOMING_EVENTS_URL, {
      responseType: "json",
    });

    const mEvents = response.body.map(
      ({ name, time, link, description, featured_photo }) => ({
        name,
        time,
        link,
        description,
        featured_photo,
      })
    );

    context.res = {
      body: mEvents,
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
