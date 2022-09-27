import { Context } from "@azure/functions";

const context: Partial<Context> = {
  log: jest.fn() as any,
  res: { body: {} },
};

export default context;
