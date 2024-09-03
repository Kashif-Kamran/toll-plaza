import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import entryValues from "../Data/entryRecord.json";
import { validationMiddleware } from "../../src/midlewares/validations";
import { tollEntrySchema } from "../../src/utils/validations";

import errorMessages from "../Data/errors.json";

describe("validationMiddleware unit test", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockSchema: Joi.ObjectSchema;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();

    mockSchema = tollEntrySchema;
  });

  it("should call next function when validation passes", async () => {
    req.body = {
      numberPlate: entryValues.numberPlate,
      entryPoint: entryValues.entryPoint,
    };

    const middleware = validationMiddleware(mockSchema);

    await middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return status code 400 when validation fails", async () => {
    req.body = { entryPoint: entryValues.entryPoint };

    const middleware = validationMiddleware(mockSchema);

    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) });
    expect(next).not.toHaveBeenCalled();
  });
  it("should return validation error message when wrong entry point entered", async () => {
    req.body = { entryPoint: "random" };

    mockSchema.validate = jest.fn().mockReturnValue({
      error: {
        details: [
          {
            message: errorMessages.wrongEntryExitpoint,
          },
        ],
      },
    });

    const middleware = validationMiddleware(mockSchema);

    await middleware(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: errorMessages.wrongEntryExitpoint,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return status code 500 and error message when an exception is thrown", async () => {
    const faultySchema = tollEntrySchema;
    faultySchema.validate = jest.fn().mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const middleware = validationMiddleware(faultySchema);

    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    expect(next).not.toHaveBeenCalled();
  });
});
