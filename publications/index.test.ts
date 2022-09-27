import { Context } from "@azure/functions";
import httpFunction from "./index";
import context from "../testing/defaultContext";

const mockResponse = `<rss>
<channel>
<item>
    <title><![CDATA[Some Title]]></title>
    <link>link1</link>
    <guid isPermaLink="false">guid1</guid>
    <dc:creator><![CDATA[Some Author]]></dc:creator>
    <pubDate>Fri, 08 Apr 2022 06:56:06 GMT</pubDate>
    <atom:updated>2022-04-08T06:55:54.267Z</atom:updated>
    <content:encoded><![CDATA[<p>Some Content</p>]]></content:encoded>
</item>
<item>
    <title><![CDATA[Some Other Title]]></title>
    <link>link2</link>
    <guid isPermaLink="false">guid2</guid>
    <dc:creator><![CDATA[Some Other Author]]></dc:creator>
    <pubDate>Fri, 09 Apr 2021 06:56:06 GMT</pubDate>
    <atom:updated>2022-04-08T06:55:54.267Z</atom:updated>
    <content:encoded><![CDATA[<p>Some other content</p>]]></content:encoded>
</item>
</channel>
</rss>`;

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
    "GetPublications function processed a request."
  );

  const expected = [
    {
      id: "guid1",
      title: "Some Title",
      author: "Some Author",
      latestPublishedAt: "Fri, 08 Apr 2022 06:56:06 GMT",
      uniqueSlug: "link1",
      paragraphs: "<p>Some Content</p>",
    },
    {
      id: "guid2",
      title: "Some Other Title",
      author: "Some Other Author",
      latestPublishedAt: "Fri, 09 Apr 2021 06:56:06 GMT",
      uniqueSlug: "link2",
      paragraphs: "<p>Some other content</p>",
    },
  ];

  expect(context.res.body).toEqual(expected);
});
