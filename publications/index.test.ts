// const httpFunction = require('./index');
// const context = require('../testing/defaultContext')
import httpFunction from "./index";
import * as context from "../testing/defaultContext";

test("Http trigger should return known text", async () => {
  const request = {
    query: { name: "Bill" },
  };

  await httpFunction(context as any, request);

  expect(context.log.mock.calls.length).toBe(1);
  expect(context.log).toBeCalledTimes(1);
  expect(context.log).toBeCalledWith(
    "GetPublications function processed a request."
  );
  expect(context.res.body[0]).toEqual(
    expect.objectContaining({
      id: "https://medium.com/p/cbf6741337d",
    })
  );
});
