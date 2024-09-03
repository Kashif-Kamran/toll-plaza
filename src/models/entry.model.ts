import mongoose, { Schema, Document, Model } from "mongoose";
import { EntryTypes } from "../types/TollEntry.types";
import { entryPoints } from "../constants";

export interface EntryDocument extends EntryTypes, Document {}
const entrySchema: Schema<EntryDocument> = new Schema({
  numberPlate: {
    type: String,
    required: true,
  },
  entryPoint: {
    type: String,
    enum: Object.keys(entryPoints),
    required: true,
  },
  exitPoint: {
    type: String,
    enum: Object.keys(entryPoints),
  },
  distanceTraveled: {
    type: Number,
    default: 0,
  },
  enterDate: {
    type: String,
    required: true,
    default: "",
  },
  exitDate: {
    type: String,
    default: null,
  },
  tax: {
    type: Number,
    default: 0,
  },
});

export const Entry: Model<EntryDocument> = mongoose.model<EntryDocument>(
  "Entries",
  entrySchema
);
