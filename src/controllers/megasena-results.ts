import { Request, Response } from "express";
import { lastResult } from "../services/last_result";

export const megasenaResults = async (req: Request, res: Response) => {
  try {
    return lastResult(res);
  } catch (error) {
    const err = error as Error;
    console.log(err.message);
  }
};
