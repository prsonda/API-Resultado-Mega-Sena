import { Request, Response } from "express";
import { fetchResultById } from "../services/consult-id";

export const megasenaResultsId = async (req: Request, res: Response) => {
	try {
		fetchResultById(req, res);
	} catch (error) {
		const err = error as Error;
		console.log(err.message);
	}
};
