import * as repo from "../../src/services/toll.repo";
import { Entry, EntryDocument } from "../../src/models/entry.model";
import { UpdateWriteOpResult,Query } from "mongoose";

import constantValues from "../Data/constants.json";
import entryValues from "../Data/entryRecord.json";

jest.mock("../../src/models/entry.model");

describe("Toll repo unit test", () => {
  const { numberPlate } = entryValues;
  const { exitPoint } = constantValues;
  test("getByNumberPlate func should return entry for a given number plate from database", async () => {
    jest
      .spyOn(Entry, "findOne")
      .mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(entryValues),
      } as unknown as Query<EntryDocument, any>);
    const result = await repo.getByNumberPlate(numberPlate);
    expect(result).toEqual(entryValues);
  });

  test("getExistingEntryByNumberPlate func should return existing entry without exit date from database", async () => {
    jest
      .spyOn(Entry, "findOne")
      .mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(entryValues),
      } as unknown as Query<EntryDocument, any>);
    const result = await repo.getExistingEntryByNumberPlate(numberPlate);
    expect(result).toEqual(entryValues);
  });
  test("createEntry func should create a new entry in database", async () => {
    const mockEntry: Partial<EntryDocument> = {
      ...entryValues,
      enterDate: new Date().toISOString(),
    };
    (Entry.create as jest.Mock).mockResolvedValue(mockEntry);

    const result = await repo.createEntry(mockEntry as EntryDocument);
    expect(result).toEqual(mockEntry);
  });
  test("updateByNumberPlate func should update an existing entry in database whose exit date is null", async () => {
    const mockResult = { nModified: 1 };
    jest
      .spyOn(Entry, "updateOne")
      .mockReturnThis()
      .mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockResult),
      } as unknown as Query<UpdateWriteOpResult, any>);
    const result = await repo.updateByNumberPlate({
      numberPlate,
      exitDate: new Date(Date.now()).toISOString(),
      exitPoint,
    });
    expect(result).toEqual(mockResult);
  });
});
