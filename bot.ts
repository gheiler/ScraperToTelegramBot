import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";

export class TelegramBot {
  bot: Telegraf;

  constructor() {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new Error("no bot token defined");
    }

    this.bot = new Telegraf(botToken);
  }

  initBot() {
    this.bot.command("quit", async (ctx: Context) => {
      // Using context shortcut
      await ctx.leaveChat();
    });

    this.bot.on(message("text"), async (ctx: Context) => {
      // Using context shortcut
      await ctx.reply(`Hello ${ctx.from?.first_name} ${ctx.from?.last_name}}`);
    });

    this.bot.on("callback_query", async (ctx: Context) => {
      // Using context shortcut
      await ctx.answerCbQuery();
    });

    this.bot.on("inline_query", async (ctx: Context) => {
      const result: any[] = [];

      // Using context shortcut
      await ctx.answerInlineQuery(result);
    });

    this.bot.start((ctx: Context) => {
      ctx.reply(
        "Welcome, to use this bot first send your search Id from inberlinwohnen website ie. from this url https://inberlinwohnen.de/wohnungsfinder/?PRd47776-Kx it would be just 'PRd47776-Kx'"
      );
    });

    this.bot.help((ctx: Context) => {
      ctx.reply(`
        You can also send your contact details so we can prefill the forms and send for you. 
        For that, say ie. Musterman Müller, Max Gustav - Höchste Str. 12, 10249, Berlin, Germany - income 3000 - 2 adults and 1 kid - needs WBS`);
    });

    this.bot.launch();

    // Enable graceful stop
    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));

    return this.bot;
  }
}
