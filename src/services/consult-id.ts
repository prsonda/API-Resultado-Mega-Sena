import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { urlSite } from "./url-site";

export const fetchResultById = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(urlSite);

		const selectFieldSearch = await page.waitForSelector("#buscaConcurso");

		const searchById = await page.type("#buscaConcurso", id);

		const searchEnter = await Promise.all([page.keyboard.press("Enter")]);

		const waitingForAnswer = await Promise.all([
			page.$$eval(".numbers > li", (el) => el.map((tex) => tex.innerHTML)),
			page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
		]);

		const contestNumber = Number(waitingForAnswer[1][18].split(" ")[1]) - 1;

		const drawnNumbers = [
			Number(waitingForAnswer[0][0]),
			Number(waitingForAnswer[0][1]),
			Number(waitingForAnswer[0][2]),
			Number(waitingForAnswer[0][3]),
			Number(waitingForAnswer[0][4]),
			Number(waitingForAnswer[0][5]),
		];

		const winners = Number(waitingForAnswer[1][35].split(" ")[0]);

		let award = Number(
			waitingForAnswer[1][28]
				.split(" ")[1]
				.replace(".", "")
				.replace(".", "")
				.replace(",", ".")
		);

		if (winners > 0) {
			award =
				winners *
				Number(
					waitingForAnswer[1][35]
						.split(" ")[4]
						.replace(".", "")
						.replace(".", "")
						.replace(",", ".")
				);
		}

		const dateContest = waitingForAnswer[1][18].split(" ")[2].slice(1, 11);

		const contest = Number(waitingForAnswer[1][18].split(" ")[1]);

		if (Number(id) > contest || Number(id) <= 0 || !Number(id)) {
			return res.status(404).json({ message: "Concurso não encontrado" });
		}

		const resultPresentation = {
			bolasSorteadas: drawnNumbers,
			premio: award, // premio principal 6 acertos
			acumulou: winners === 0 ? true : false,
			concursoAnterior: contestNumber,
			concurso: contest,
			dataConcurso: dateContest,
		};

		res.json(resultPresentation);

		await browser.close();
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Erro de servidor, faça a busca novamente" });
	}
};
