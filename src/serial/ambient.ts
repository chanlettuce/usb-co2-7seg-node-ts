const Ambient = require('ambient-lib');

const channelId = process.env.AMBIENT_CHANNEL_ID;
const writeKey = process.env.AMBIENT_WRITE_KEY;

if (!channelId || !writeKey) {
  console.error('Ambientのキーがおかしいよ');
  process.exit(1);
}

const ambient = new Ambient(+channelId, writeKey);

export const sendAmbient = (co2: number, temp: number, humidity: number) =>
  new Promise<void>((resolve, reject) => {
    ambient.send({ d1: co2, d2: temp, d3: humidity }, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
