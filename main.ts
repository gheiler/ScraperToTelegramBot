import "dotenv/config";
import "./migrator";

import { TelegramBot } from "./bot";

new TelegramBot().initBot();
