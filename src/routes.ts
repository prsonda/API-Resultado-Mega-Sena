import { Router } from "express";
import { megasenaResultsId } from "./controllers/megasena-result-id";
import { megasenaResults } from "./controllers/megasena-results";

export const routes = Router();

routes.get("/megasena/resultados", megasenaResults);
routes.get("/megasena/resultados/:id", megasenaResultsId);
