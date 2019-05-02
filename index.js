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

  const doorbell = new Gpio(17, 'in', 'falling', {debounceTimeout: 10});

  await client.login(process.env.DISCORD_TOKEN);
  await ready;

  let last = Date.now();
  doorbell.watch(async () => {
    if (Date.now() > last + 1000 * 10) {
      client.channels.get(process.env.DISCORD_CHANNEL).send(`<@${process.env.DISCORD_USER}> ピンポン鳴ったぞ！`);
      last = Date.now();
    }
  });

  process.on('SIGINT', () => {
    doorbell.unexport();
  });
})();
