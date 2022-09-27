import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import got from "got";

type MeetupResponse = Array<{
  name: string;
  time: string;
  link: string;
  description: string;
  featured_photo: string;
}>;

// Meetup API test console: https://secure.meetup.com/meetup_api/console/?path=/:urlname/events
const GET_PAST_EVENTS_URL =
  'https://api.meetup.com/Codestar-Night/events?&sign=true&photo-host=public&page=20&desc=true&status=past&fields=featured_photo';
const FALLBACK_IMAGE =
  'https://res.cloudinary.com/codestar/image/upload/v1532409289/codestar.nl/meetup/codestar-night-logo.jpg';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('GetPastEvents function processed a request.');
    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };

};

export default httpTrigger;