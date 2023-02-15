import express from "express";
import { routes } from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger.json";
var cors = require("cors");

export const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
