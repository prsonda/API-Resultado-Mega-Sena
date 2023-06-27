import { app } from "./app";
require("dotenv").config();

const port = process.env.PORT || 3030;

const server = app.listen(port, () => {
  console.info(`Aplicação iniciada na porta ${port}`);
});

process.on("SIGINT", () => {
  server.close();
  console.info("Aplicação encerrada");
});
