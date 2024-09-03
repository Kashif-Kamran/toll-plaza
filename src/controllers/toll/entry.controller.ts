import { Request, Response } from "express";

import * as repo from "../../services/toll.repo";
import { EntryDocument } from "../../models/entry.model";

export default async function enterToll(
  req: Request,
  res: Response
): Promise<void> {
  const {
    numberPlate,
    entryPoint,
  }: { numberPlate: string; entryPoint: string } = req.body;
  try
  {
    const exist: EntryDocument | null =
      await repo.getExistingEntryByNumberPlate(numberPlate);
    if (exist)
    {
      res.status(400).json({ message: "Vehicle is on motorway." });
      return;
    }
    const enterDate: string = new Date(Date.now()).toISOString();
    await repo.createEntry({ numberPlate, entryPoint, enterDate });
    res.status(201).json({ message: "Vehicle entered successfully." });
  } catch (e: any)
  {
    res.status(500).json({ error: e.message });
  }
}
