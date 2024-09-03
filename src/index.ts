import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv'

import tollRoutes from "./routes";

import { connectToDb } from "./utils/connection";
import { routes } from "./constants/routes";

const { SERVER } = routes

const app: Express = express();

dotenv.config();

app.use(bodyParser.json());

connectToDb();
app.use(SERVER, tollRoutes);

export default app;



