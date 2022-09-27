import { IMeetupEvent, MeetupEventWithoutPhoto } from "./meetup.types";
import got from "got";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/codestar/image/upload/v1532409289/codestar.nl/meetup/codestar-night-logo.jpg";

export const addEventPhoto = async ({
  featured_photo: featuredPhoto,
  ...mEventWithoutPhoto
}: IMeetupEvent) => {
  const resolvedPhoto =
    featuredPhoto || (await getEventPhoto(mEventWithoutPhoto));
  return {
    featured_photo: resolvedPhoto,
    ...mEventWithoutPhoto,
  };
};

const getEventPhoto = async (mEventWithoutPhoto: MeetupEventWithoutPhoto) => {
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
    return {
      photo_link: FALLBACK_IMAGE,
    };
  }
};
