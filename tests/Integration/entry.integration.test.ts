import { Request, Response } from "express";
import request from "supertest";
import app from "../../src/index";
import * as repo from "../../src/services/toll.repo";
import entryValues from "../Data/entryRecord.json";

import { routes } from "../../src/constants/routes";

const { ENTER, SERVER } = routes;
jest.mock("../../src/services/toll.repo");
jest.mock("../../src/utils/connection");
describe("Toll plaza entry module integration test", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const { entryPoint, numberPlate } = entryValues;
  beforeEach(() => {
    req = {
      body: {
        entryPoint,
        numberPlate,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  it("should store entry in database and respond with status code 201 if vehicle enters successfully", async () => {
    const response = await request(app)
      .post(`${SERVER}${ENTER}`)
      .set("content-type", "application/json")
      .send(req.body);
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValue(null);
    (repo.createEntry as jest.Mock).mockResolvedValue(entryValues);

    expect(response.status).toBe(201);
  });
  it("should respond with status code 400 if vehicle is on motorway", async () => {
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockResolvedValue(
      entryValues
    );
    const response = await request(app)
      .post(`${SERVER}${ENTER}`)
      .set("content-type", "application/json")
      .send(req.body);
    expect(response.status).toBe(400);
  });
  it("should respond with status code 500 if system encounters error or crash", async () => {
    const error = new Error("Something went wrong");
    (repo.getExistingEntryByNumberPlate as jest.Mock).mockRejectedValue(error);
    const response = await request(app)
      .post(`${SERVER}${ENTER}`)
      .set("content-type", "application/json")
      .send(req.body);
    expect(response.status).toBe(500);
  });
});
