import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { urlSite } from "./url-site";

export const fetchResultById = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.goto(urlSite);

		const searchCurrentContest = await Promise.all([
			page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
		]);

		if (searchCurrentContest === undefined) {
			return res
				.status(500)
				.json({ message: "Erro de servidor, faça a busca novamente" });
		}

		const currentContest = Number(searchCurrentContest[0][18].split(" ")[1]);

		if (Number(id) > currentContest || Number(id) <= 0 || !Number(id)) {
			return res.status(404).json({
				message: "Concurso não encontrado, digite um concurso válido!",
			});
		}

		const selectFieldSearch = await page.waitForSelector("#buscaConcurso");

		const searchById = await page.type("#buscaConcurso", id);

		const searchEnter = await Promise.all([page.keyboard.press("Enter")]);

		const contestNumber = await Promise.all([
			page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
		]);

		const numberOfWinners = await Promise.all([
			page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
		]);

		const waitingForAnswer = await Promise.all([
			page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
		]);

		if (
			contestNumber === undefined ||
			numberOfWinners === undefined ||
			waitingForAnswer === undefined
		) {
			return res
				.status(500)
				.json({ message: "Erro de servidor, faça a busca novamente" });
		}

		const contestPrevious = Number(waitingForAnswer[0][18].split(" ")[1]) - 1;

		const contest: number = Number(waitingForAnswer[0][18].split(" ")[1]);

		if (contest !== Number(id)) {
			return res.status(422).json({
				message: "Solicitação não processada a tempo, faça a busca novamente",
			});
		}

		const winners = Number(waitingForAnswer[0][35].split(" ")[0]);

		let award = Number(
			waitingForAnswer[0][28]
				.split(" ")[1]
				.replace(".", "")
				.replace(".", "")
				.replace(",", ".")
		);

		if (winners > 0) {
			award =
				winners *
				Number(
					waitingForAnswer[0][35]
						.split(" ")[4]
						.replace(".", "")
						.replace(".", "")
						.replace(",", ".")
				);
		}

		const dateContest = waitingForAnswer[0][18].split(" ")[2].slice(1, 11);

		const drawnNumbers = [
			Number(waitingForAnswer[0][20]),
			Number(waitingForAnswer[0][21]),
			Number(waitingForAnswer[0][22]),
			Number(waitingForAnswer[0][23]),
			Number(waitingForAnswer[0][24]),
			Number(waitingForAnswer[0][25]),
		];

		const resultPresentation = {
			bolasSorteadas: drawnNumbers,
			premio: award, // premio principal 6 acertos
			acumulou: winners === 0 ? true : false,
			concursoAnterior: contestPrevious,
			concurso: contest,
			dataConcurso: dateContest,
		};

		res.json(resultPresentation);

		await browser.close();
	} catch (error) {
		const err = error as Error;
		console.log(err.message);
		return res
			.status(500)
			.json({ message: "Erro de servidor, faça a busca novamente" });
	}
};
