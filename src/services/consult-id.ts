import { Request, Response } from "express";
import { launch } from "puppeteer";
import { urlSite } from "./url-site";

export const fetchResultById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const browser = await launch();
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

    let waitingForAnswer = await Promise.all([
      page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
    ]);

    if (waitingForAnswer === undefined) {
      return res
        .status(500)
        .json({ message: "Erro de servidor, faça a busca novamente" });
    }

    let contest: number = Number(waitingForAnswer[0][18].split(" ")[1]);

    while (contest !== Number(id)) {
      waitingForAnswer = await Promise.all([
        page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
      ]);

      contest = Number(waitingForAnswer[0][18].split(" ")[1]);
    }

    const contestPrevious = Number(waitingForAnswer[0][18].split(" ")[1]) - 1;

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

    const drawn = await Promise.all([
      page.$$eval(".ng-binding", (el) => el.map((tex) => tex.innerHTML)),
    ]);

    const drawnNumbers = [
      Number(drawn[0][20]),
      Number(drawn[0][21]),
      Number(drawn[0][22]),
      Number(drawn[0][23]),
      Number(drawn[0][24]),
      Number(drawn[0][25]),
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
