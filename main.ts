import "dotenv/config";
import "./migrator";
import { executeUserSearch } from "./jobs";

import { TelegramBot } from "./bot";

new TelegramBot().initBot();

// kill jobs before app exits
process.on("exit", () => {
  console.log("stopping all jobs");
  executeUserSearch.stop();
  console.log("stopped all jobs");
});
