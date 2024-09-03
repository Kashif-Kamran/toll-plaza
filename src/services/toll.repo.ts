import { UpdateWriteOpResult } from "mongoose";

import { Entry, EntryDocument } from "../models/entry.model";
import { EntryTypes } from "../types/TollEntry.types";

// Get data by number plate
export const getByNumberPlate = (
  numberPlate: string
): Promise<EntryDocument | null> => {
  return Entry.findOne({ numberPlate, exitDate: { $ne: null } }).exec();
};

// Get existing entry by number plate
export const getExistingEntryByNumberPlate = (
  numberPlate: string
): Promise<EntryDocument | null> => {
  return Entry.findOne({ numberPlate, exitDate: { $eq: null } }).exec();
};

// Create new record
export const createEntry = (args: EntryTypes): Promise<EntryDocument> => {
  return Entry.create(args);
};

// Update by number plate
export const updateByNumberPlate = (
  args: Partial<EntryTypes>
): Promise<UpdateWriteOpResult> => {
  return Entry.updateOne(
    { numberPlate: args.numberPlate, exitDate: { $eq: null } },
    {
      $set: {
        exitDate: args.exitDate,
        exitPoint: args.exitPoint,
        distanceTraveled: args.distanceTraveled,
        tax: args.tax,
      },
    }
  ).exec();
};
