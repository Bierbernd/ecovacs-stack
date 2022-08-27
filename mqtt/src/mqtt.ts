import 'dotenv/config';

import fs from 'fs';
import { connect } from 'mqtt';
import { sendJSONCommand } from './commands/commands';
import { BotCommand } from './commands/commands.model';

const ca = fs.readFileSync('/opt/app/src/ca.crt');

const client = connect('mqtts://request-listener:8883', { ca });
console.info('starting mqtts listener');

client.on('connect', () => {
  console.log('connected');

  client.subscribe('iot/atr/#');
  client.subscribe(`iot/cfg/#`);
  client.subscribe(`iot/dtcfg/#`);
  client.subscribe(`iot/dtgcfg/#`);

  client.subscribe(
    `iot/p2p/+/${process.env.BOTID}/${process.env.BOTCLASS}/${process.env.RESOURCE}/+/+/+/p/+/j`,
    (err) => {
      if (!err) {
        const command: BotCommand = {
          name: 'playSound',
          payload: { code: 0 },
        };
        sendJSONCommand(command, client);
      }
    },
  );
});

client.on('error', (err) => {
  console.log('error', err);
});

client.on('message', (topic, message) => {
  console.log(getColoredConsoleLog(topic), message.toString());
});

const getColoredConsoleLog = (topic: string) => {
  let color = 32;
  if (topic.includes('p2p')) {
    color = 36;
  }
  return `\x1b[${color}m[${topic}]\x1b[0m`;
};