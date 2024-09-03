import { NextFunction, Request, Response } from "express";
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try
    {
        const allowedUser = { id: "01", fullName: "Kashif Kamran", email: "kashifkamran.aavli@gmail.com" }
        if (!req.headers.authorization) return res.status(401).send({ message: "User not authorized" })
        const authEmail = req.headers.authorization
        if (authEmail !== allowedUser.email) return res.status(403).send({ message: "User not authorized" });
        next()
    }
    catch (error)
    {
        return res.status(500).send({ message: "Something went wrong" });
    }
}
export default authMiddleware;