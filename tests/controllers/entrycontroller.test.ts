import { Request, Response } from "express";
import * as repo from "../../src/services/toll.repo";
import enterToll from "../../src/controllers/toll/entry.controller";
import entryValues from "../Data/entryRecord.json";

jest.mock("../../src/services/toll.repo");

describe("Toll plaza entry controller unit test", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  beforeEach(() => {
    req = {
      body:{ numberPlate:entryValues.numberPlate, entryPoint:entryValues.entryPoint },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should respond with status code 400 if vehicle is on motorway", async () => {
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValueOnce(
       entryValues
    );

    await enterToll(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vehicle is on motorway.",
    });
  });

  it("should store entry in database and respond with status code 201 if vehicle enters successfully", async () => {
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValue(null);
    (repo.createEntry as jest.Mock).mockResolvedValue(entryValues);

    await enterToll(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vehicle entered successfully.",
    });
  });

  it("should respond with status code 500 to handle error properly", async () => {
    const error = new Error("Something went wrong");
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockRejectedValue(error);

    await enterToll(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});