import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import got from "got";
import {
  IMeetupEvent,
  MeetupResponse,
  PluckedMeetupEvent,
} from "./meetup.types";
import { addEventPhoto } from "./addEventPhoto";

// Meetup API test console: https://secure.meetup.com/meetup_api/console/?path=/:urlname/events
const GET_PAST_EVENTS_URL =
  "https://api.meetup.com/Codestar-Night/events?&sign=true&photo-host=public&page=20&desc=true&status=past&fields=featured_photo";

function pluckEventProperties({
  name,
  time,
  link,
  featured_photo,
}: IMeetupEvent): PluckedMeetupEvent {
  return {
    name,
    time,
    link,
    featured_photo,
  };
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GetPastEvents function processed a request.");

  try {
    const response = await got<MeetupResponse>(GET_PAST_EVENTS_URL, {
      responseType: "json",
    });

    // If Meetup.com does not have a featured_photo, try to fallback to a Cloudinary image
    const mEventsWithGuaranteedPhoto = await Promise.all(
      response.body.map(pluckEventProperties).map(addEventPhoto)
    );

    context.res = {
      body: mEventsWithGuaranteedPhoto,
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
