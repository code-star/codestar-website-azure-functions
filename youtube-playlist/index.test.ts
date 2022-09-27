import { Context } from "@azure/functions";
import context from "../testing/defaultContext";
import httpFunction, { IPlaylistResponse } from "./index";

const mockResponse: IPlaylistResponse = {
  items: [
    {
      contentDetails: {
        videoId: "123",
        videoPublishedAt: "2022-01-31",
      },
      snippet: {
        title: "Some Title",
        description: "Some Description",
        thumbnails: [{}],
      },
    },
  ],
};

jest.mock("got", () => ({
  default: () => Promise.resolve({ body: mockResponse }),
}));

test("Http trigger should return known text", async () => {
  const request = {
    query: { count: 100 },
  };

  await httpFunction(context as Context, request);

  expect(context.log).toBeCalledTimes(1);
  expect(context.log).toBeCalledWith(
    "GetYoutubePlaylist function processed a request."
  );
  expect(context.res.body).toEqual([
    {
      title: "Some Title",
      description: ["Some Description"],
      id: "123",
      publishedAt: new Date("2022-01-31T00:00:00.000Z"),
      thumbnails: [{}],
    },
  ]);
});
