import { Telegraf } from "telegraf";
const token: any =  process.env.TELEGRAM_TOKEN;
const bot: Telegraf = new Telegraf(token);

bot.start((ctx) => {
    console.log(JSON.stringify(ctx));
	ctx.reply(`
    Hi ${ctx.update.message.from.first_name} what can i help you ? these are following command can help you
    - /active-gigs
    - /all-gigs
    `);
});

bot.hears("/", async (ctx) => {
    ctx.reply("Success");
});

export default bot;