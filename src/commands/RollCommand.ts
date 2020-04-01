import { Command } from '../Api';
import { Message } from 'discord.js';

export default class RollCommand implements Command {
  readonly name = 'roll';
  readonly aliases = ['r'];
  readonly usage = '`<[X]dY[+Z]>` lub `<[X]kY[+Z]>` (X - liczba kości, Y - wartość kości, Z - bonus)';
  readonly description = 'rzuć kośćmi';
  execute(message: Message, args: string[]): Promise<Message> {
    if (args.length < 1) return message.channel.send(`Podaj argumenty`);
    if (args.length > 5) return message.channel.send(`Maksymalna liczba argumentów wynosi 5`);

    const rolls = [];
    for (const arg of args) {
      const validationRegex = /^(\d+)?[dk](\d+)(\+\d+)?$/;
      const isValid = RegExp(validationRegex).test(arg);
      if (!isValid) return message.channel.send(`Niewłaściwy format argumentów (\`${arg}\`)`);

      const values = arg.match(validationRegex);

      const howManyDice = Number(values[1]) || 1;
      const diceValue = Number(values[2]);
      const plus = Number(values[3]);

      if (howManyDice > 50)
        return message.channel.send(`Niewłaściwa ilość kości (\`${howManyDice}\`)`);

      if (diceValue < 2 || diceValue > 300) 
        return message.channel.send(`Niewłaściwa wartość kości (\`${diceValue}\`)`);

      rolls.push(rollDice(howManyDice, diceValue, plus));
    }

    let response = '';
    for (const roll of rolls) {
      response = response.concat(
        `\`${roll.string}\` ( ${roll.valuesStrings.join('+')} ) = ${roll.sumString}\n` +
        `Sukcesów: ${roll.successes}\n` +
        `Porażek: ${roll.failures}\n` +
        `\n`
      );
    }
    return message.channel.send(response);
  }
}

function randomNumber(diceValue: number): number{
  return (Math.floor(Math.random() * diceValue) + 1);
}

function rollDice(howManyDice: number, diceValue: number, plus?: number): Roll {
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

  const roll: Roll = {
    string: `${howManyDice}d${diceValue}${plus ? '+'+plus : ''}`,
    values,
    valuesStrings,
    sumString: (plus ? `${sum} + ${plus} = ${sum + plus}` : sum.toString()),
    successes,
    failures,
  }

  return roll;
}

type Roll = {
  string: string;
  values: number[];
  valuesStrings: string[];
  sumString: string;
  successes: number;
  failures: number;
}