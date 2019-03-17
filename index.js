require('dotenv').config();
const discord = require('discord.js');
const {Gpio} = require('onoff');

(async () => {
  const client = new discord.Client();
  const ready = new Promise(resolve => {
    client.on('ready', () => {
      resolve();
    });
  });

  const doorbell = new Gpio(17, 'in', 'falling', {debounceTimeout: 100});

  await client.login(process.env.DISCORD_TOKEN);
  await ready;

  doorbell.watch((err, level) => {
    console.log(level);

    client.channels.get(process.env.DISCORD_CHANNEL).send(`<@${process.env.DISCORD_USER}> ピンポン鳴ったぞ！`);
  });

  process.on('SIGINT', () => {
    doorbell.unexport();
  });
})();
