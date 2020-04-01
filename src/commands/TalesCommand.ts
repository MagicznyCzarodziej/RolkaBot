import { Command } from '../Api';
import { Message } from 'discord.js';

export default class TalesCommand implements Command {
  readonly name = 'tales';
  readonly aliases = ['t', 'tftl'];
  readonly usage = '`<liczba kości>`';
  readonly description = 'rzuć kośćmi d6';
  execute(message: Message, args: string[]): Promise<Message> {
    if (args.length > 1) return message.channel.send(`Maksymalna liczba argumentów wynosi 1`);
    
    const howManyDice = args.length > 0 ? parseInt(args[0]) : 6;
    if (isNaN (howManyDice) || howManyDice < 1)
      return message.channel.send(`Niewłaściwa wartość (\`${args[0]}\`)`);

    const values = new Array(howManyDice).fill(undefined).map(() => {
      return randomNumber(6);
    });

    const successes = values.reduce((sum, current) => {
      return current === 6 ? (sum + 1) : sum;
    }, 0);

    const valuesStrings = values.map((number) => {
      return (number === 6) ? `**${number}**` : number.toString();
    });

    const emojiCo = message.client.emojis.cache.find((emoji) => emoji.name === 'wasylco');
    const emojiCool = message.client.emojis.cache.find((emoji) => emoji.name === 'wasylcool');

    const response = `\`${howManyDice}d6\` ( ${valuesStrings.join('+')} )\n`+
      `Sukcesów: ${successes} ${successes > 0 ? emojiCool : emojiCo}`;
    return message.channel.send(response);
  }
}

function randomNumber(diceValue: number): number {
  return (Math.floor(Math.random() * diceValue) + 1);
}