
//const token = '5754986090:AAFD6sobDFKxA_4tNUFfsKbUsB_5-tD1hD8';
const { loadEnv, dock, dockStart } = require('@nlpjs/basic');
const { Telegraf } = require('telegraf');
 
(async() => {
  loadEnv();
  const options = {
    settings: {
      nlp: {
        corpora: ["./data/corpus-en.json", "./data/corpus-es.json"]
      },
      "api-server": {
        port: process.env.PORT || 5000,
        serveBot: true
      }
    },
    use: ["Basic", "LangEn", "LangEs", "ConsoleConnector", "ExpressApiServer", "DirectlineConnector"]
  };
  await dockStart(options);
  const nlp = dock.get('nlp');
  await nlp.train();
  const data = await nlp.process('text');
  console.log(data.answer);
  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.on('text', async(ctx) => {
    const text = ctx.message.text;
    const response = await nlp.process(text);
    ctx.reply(response.answer);
  });
  bot.launch();
})();


