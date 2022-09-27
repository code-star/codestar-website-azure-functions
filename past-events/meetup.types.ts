export interface IMeetupEvent {
  name: string;
  time: string;
  link: string;
  description: string;
  featured_photo: string;
}

export type PluckedMeetupEvent = Omit<IMeetupEvent, "description">;

export type MeetupEventWithoutPhoto = Omit<IMeetupEvent, "featured_photo">;

export type MeetupResponse = Array<IMeetupEvent>;
