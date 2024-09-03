import { Request, Response } from "express";

import * as repo from "../../src/services/toll.repo";
import request from "supertest";
import app from "../../src/index";
import constantValues from "../Data/constants.json";
import entryValues from "../Data/entryRecord.json";

import { Days } from "../../src/constants";
import { routes } from "../../src/constants/routes";

const { EXIT, SERVER } = routes;

jest.mock("../../src/services/toll.repo");
jest.mock("../../src/utils/connection");

describe("Toll plaza exit module integration test", () => {
  const { evenNumberplate, holidayDate, exitPoint } = constantValues;
  let req: Partial<Request>;
  let res: Partial<Response>;
  const RealDate = Date.now;

  beforeEach(() => {
    req = {
      body: {
        numberPlate: evenNumberplate,
        exitPoint,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    global.Date.now = RealDate;
  });

  it("should calculate tax and update record in database and respond with status code 200", async () => {
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValue({
      ...entryValues,
      enterDate: holidayDate,
      numberPlate: evenNumberplate,
    });

    global.Date.now = jest.fn(() => new Date(holidayDate).getTime());
    const response = await request(app)
      .put(`${SERVER}${EXIT}`)
      .set("content-type", "application/json")
      .send(req.body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      toll: 11.6,
      numberPlate: evenNumberplate,
      enterDay: Days[new Date(holidayDate).getDay()],
      exitDay: Days[new Date(Date.now()).getDay()],
      distanceTraveled: 29,
    });
  });
  it("should respond with status code 404 and vehicle entry not found", async () => {
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValueOnce(
      null
    );
    const response = await request(app)
      .put(`${SERVER}${EXIT}`)
      .set("content-type", "application/json")
      .send(req.body);
    expect(response.status).toBe(404);
  });
  it("should respond with status code 500 if system encounters error or crash", async () => {
    const error = new Error("Something went wrong");
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockRejectedValue(error);
    const response = await request(app)
      .put(`${SERVER}${EXIT}`)
      .set("content-type", "application/json")
      .send(req.body);
    expect(response.status).toBe(500);
  });
});
