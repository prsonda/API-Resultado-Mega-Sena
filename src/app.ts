import express from "express";
import { serve, setup } from "swagger-ui-express";
import { routes } from "./routes";
import swaggerDoc from "./swagger.json";
var cors = require("cors");

export const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.use("/api-docs", serve, setup(swaggerDoc));
