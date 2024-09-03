import { Request, Response } from "express";

import * as repo from "../../src/services/toll.repo";
import exitToll from "../../src/controllers/toll/exit.controller";
import constantValues from "../Data/constants.json";
import entryValues from "../Data/entryRecord.json";

import { Days } from "../../src/constants";

jest.mock("../../src/services/toll.repo");

describe("Toll plaza exit controller unit test", () => {
  const {evenNumberplate,holidayDate,weekEnddate,exitDate,exitPoint}=constantValues;
  let req: Partial<Request>;
  let res: Partial<Response>;
  const RealDate = Date.now
  const body={
    ...entryValues
  }

  beforeEach(() => {
    req = {
      body: { numberPlate:entryValues.numberPlate, exitPoint },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

afterEach(() => {
  global.Date.now = RealDate
})

//no discount
  it("calculate tax when car has a valid entry", async () => {
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValueOnce(body);
  
    global.Date.now = jest.fn(() => new Date(exitDate).getTime())
    await exitToll(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      toll: 25.8,
      numberPlate: body.numberPlate,
      enterDay: Days[new Date(body.enterDate).getDay()],
      exitDay: Days[new Date(Date.now()).getDay()],
      distanceTraveled: 29,
    });
  });
//discount basis of holidays should be applied
it("calculate tax When discount applied based on numberplate when car has a valid entry", async () => {
  req = {
    body: { numberPlate: evenNumberplate, exitPoint },
  };
  (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValue({...body,enterDate:holidayDate,numberPlate:evenNumberplate});

  global.Date.now = jest.fn(() => new Date(holidayDate).getTime())
  await exitToll(req as Request, res as Response);
  
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    toll: 11.6,
    numberPlate: evenNumberplate,
    enterDay: Days[new Date(holidayDate).getDay()],
    exitDay: Days[new Date(Date.now()).getDay()],
    distanceTraveled: 29,
  });
});

//1.5x on saturday sunday
it("calculate tax When rate is 1.5x on saturday sunday and when car has a valid entry", async () => {
  (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValueOnce(body);

  global.Date.now = jest.fn(() => new Date(weekEnddate).getTime())
  await exitToll(req as Request, res as Response);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    toll: 28.7,
    numberPlate: body.numberPlate,
    enterDay: Days[new Date(body.enterDate).getDay()],
    exitDay: Days[new Date(Date.now()).getDay()],
    distanceTraveled: 29,
  });
});
  it("should respond with status code 404 if vehicle havent cross any toll plaza", async () => {
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValueOnce(
      null
    );

    await exitToll(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No vehicle entry found",
    });
  });

  it("should respond with status code 500 to handle error properly", async () => {
    const error = new Error("Something went wrong");
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockRejectedValue(error);

    await exitToll(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
});
