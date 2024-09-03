import Joi from "joi";
import { entryPoints } from "../constants";

export const tollEntrySchema: Joi.ObjectSchema = Joi.object({
  entryPoint: Joi.string().required().trim().valid(...Object.keys(entryPoints)),
  numberPlate: Joi.string().required().trim(),
});

export const tollExitSchema: Joi.ObjectSchema = Joi.object({
  numberPlate: Joi.string().required().trim(),
  exitPoint: Joi.string().required().trim().valid(...Object.keys(entryPoints)),
});
