import { NextFunction, Request, Response } from "express";

import Joi from "joi";

export const validationMiddleware = (schema: Joi.ObjectSchema) => {
    return async function (req: Request, res: Response, next: NextFunction) {
        try
        {
            const { error, value } = schema.validate(req.body)
            if (error)
            {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            req.body = value
            next()
        } catch (err)
        {
            res.status(500).json({ error: err });
            return;
        }
    }
}