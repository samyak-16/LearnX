import { env } from "./Config/env.js";
import { app } from "./app.js";
import { mongodb } from "./Config/mongo.js";

const PORT = env.PORT || 3000;

async function startServer() {
  await mongodb();

  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer();
