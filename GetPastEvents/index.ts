import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import got from "got";

interface IMeetupEvent {
  name: string;
  time: string;
  link: string;
  description: string;
  featured_photo: string;
}

type PluckedMeetupEvent = Omit<IMeetupEvent, "description">;

type MeetupEventWithoutPhoto = Omit<IMeetupEvent, "featured_photo">;

type MeetupResponse = Array<IMeetupEvent>;

// Meetup API test console: https://secure.meetup.com/meetup_api/console/?path=/:urlname/events
const GET_PAST_EVENTS_URL =
  "https://api.meetup.com/Codestar-Night/events?&sign=true&photo-host=public&page=20&desc=true&status=past&fields=featured_photo";
const FALLBACK_IMAGE =
  "https://res.cloudinary.com/codestar/image/upload/v1532409289/codestar.nl/meetup/codestar-night-logo.jpg";

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

async function addEventPhoto({
  featured_photo: featuredPhoto,
  ...mEventWithoutPhoto
}: IMeetupEvent) {
  const resolvedPhoto =
    featuredPhoto || (await getEventPhoto(mEventWithoutPhoto));
  return {
    featured_photo: resolvedPhoto,
    ...mEventWithoutPhoto,
  };
}

async function getEventPhoto(mEventWithoutPhoto: MeetupEventWithoutPhoto) {
  // Generate a valid file name
  const cleanName = mEventWithoutPhoto.name.replace(/[^\w]/g, "");
  const photoUrl = `https://res.cloudinary.com/codestar/image/upload/e_art:fes,c_fill,h_170,w_300/v1533472199/codestar.nl/meetup/${cleanName}`;
  // Check if Cloudinary image exists
  try {
    const imgHead = await got.head(photoUrl, { responseType: "json" });
    const hasValidLength = parseInt(imgHead.headers["content-length"], 10) > 0;
    if (hasValidLength) {
      return {
        photo_link: photoUrl,
      };
    }
    throw new Error("No image found or parsing failed");
  } catch (err) {
    // E.g. 404 because not found
    return Promise.resolve({
      photo_link: FALLBACK_IMAGE,
    });
  }
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
