import { Request, Response } from "express";

import * as repo from "../../services/toll.repo";
import { discountCheck } from "../../utils/helpers";
import { EntryDocument } from "../../models/entry.model";
import { ExitToll } from "../../types/TollExit.types";
import {
  entryPoints,
  baseRate,
  distanceRate,
  nationalHolidays,
  Days,
} from "../../constants";

export default async function exitToll(
  req: Request,
  res: Response
): Promise<void> {
  const { numberPlate, exitPoint }: { numberPlate: string; exitPoint: string } =
    req.body;

  try
  {
    const data: EntryDocument | null = await repo.getExistingEntryByNumberPlate(
      numberPlate
    );
    if (!data)
    {
      res.status(404).json({ message: "No vehicle entry found" });
      return;
    }

    const exitDateTime: string = new Date(Date.now()).toISOString();
    const exitDay: number = new Date(Date.now()).getDay();
    const entryDay: number = new Date(data.enterDate).getDay();
    const entryDistance: number = entryPoints[data.entryPoint];
    const exitDistance: number = entryPoints[exitPoint];
    const distanceTraveled: number = Math.abs(exitDistance - entryDistance);
    let toll: number = baseRate + distanceTraveled * distanceRate;

    // Increase toll on weekends
    if (exitDay === 6 || exitDay === 0)
    {
      toll += distanceTraveled * distanceRate * 0.5;
    }

    // Apply discount if applicable
    if (discountCheck(exitDay, data.numberPlate))
    {
      toll *= 0.9;
    }

    // Apply holiday discount if applicable
    if (nationalHolidays.includes(data.enterDate.split("T")[0]))
    {
      toll *= 0.5;
    }

    await repo.updateByNumberPlate({
      numberPlate,
      distanceTraveled,
      exitDate: exitDateTime,
      exitPoint,
      tax: Number(toll.toPrecision(3)),
    });

    const response: ExitToll = {
      toll: Number(toll.toPrecision(3)),
      numberPlate,
      distanceTraveled,
      enterDay: Days[entryDay],
      exitDay: Days[exitDay],
    };

    res.status(200).json(response);
  } catch (e: any)
  {
    res.status(500).json({ error: e.message });
  }
}
