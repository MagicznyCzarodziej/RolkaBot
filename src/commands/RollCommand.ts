import { ICommand } from '../Api';
import { Message } from 'discord.js';

export default class RollCommand implements ICommand {
  readonly name = 'roll';
  readonly aliases = ['r'];
  readonly usage = '`<XdY>` lub `<XkY>` (X - liczba kości, Y - wartość kości)';
  readonly description = 'rzuć kośćmi';
  execute(message: Message, args: string[]) {
    if (args.length < 1) {
      message.channel.send(`Podaj argumenty (np. \`2d6\` lub \`1k8\`)`);
      return;
    }

    if (args.length > 5) {
      message.channel.send(`Maksymalna liczba argumentów wynosi 5`);
      return;
    }

    const rolls = [];
    for (const arg of args) {
      const splitted = arg.split(/[dk]/);
      const howManyDice = parseInt(splitted[0], 10);
      const diceValue = parseInt(splitted[1], 10);

      if (isNaN(howManyDice) || isNaN(diceValue)) {
        message.channel.send(`Niewłaściwy format argumentów (\`${arg}\`), spróbuj \`2d6\` lub \`1k8\``);
        return;
      }

      if (howManyDice < 1 || diceValue < 2) {
        message.channel.send(`Niewłaściwe wartości (\`${arg}\`)`);
        return;
      }

      rolls.push(rollDice(howManyDice, diceValue));
    }

    let response = '';
    for (const roll of rolls) {
      response = response.concat(
        `\`${roll.string}\` ( ${roll.valuesStrings.join('+')} ) = ${roll.sum}\n` +
        `Sukcesów: ${roll.successes}\n` +
        `Porażek: ${roll.failures}\n` +
        `\n`
      );
    }
    message.channel.send(response);
  }
}

function randomNumber(diceValue: number) {
  return (Math.floor(Math.random() * diceValue) + 1);
}

function rollDice(howManyDice: number, diceValue: number) {
  const values = new Array(howManyDice).fill(undefined).map(() => {
    return randomNumber(diceValue);
  });
  
  const sum = values.reduce((sum, current) => {
    return sum + current;
  }, 0);
  const successes = values.reduce((sum, current) => {
    return current === diceValue ? (sum + 1) : sum;
  }, 0);
  const failures = values.reduce((sum, current) => {
    return current === 1 ? (sum + 1) : sum;
  }, 0);

  // Bold failures and succcesses
  const valuesStrings = values.map((number) => {
    return (number === 1 || number === diceValue) ? `**${number}**` : number.toString();
  });

  const roll = {
    string: `${howManyDice}d${diceValue}`,
    values,
    valuesStrings,
    sum,
    successes,
    failures,
  }

  return roll;
}