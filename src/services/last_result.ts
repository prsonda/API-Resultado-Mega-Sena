import { Response } from "express";
import { launch } from "puppeteer";
import { urlSite } from "./url-site";

export const lastResult = async (res: Response) => {
  try {
    const browser = await launch();
    const page = await browser.newPage();

    await page.goto(urlSite);

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

    const numberWinners = waitingForAnswer[1][35].split(" ")[0];

    const dateContest = waitingForAnswer[1][18].split(" ")[2].slice(1, 11);

    const contest = Number(waitingForAnswer[1][18].split(" ")[1]);

    const resultPresentation = {
      bolasSorteadas: drawnNumbers,
      premio: award, // premio principal 6 acertos
      acumulou: numberWinners === "0" ? true : false,
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
