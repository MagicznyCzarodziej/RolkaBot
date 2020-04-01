import { ICommand } from '../Api';
import { Message, MessageEmbed } from 'discord.js';
import Rolka from '../Rolka';

export default class HelpCommand implements ICommand {
  private bot: Rolka;
  readonly name = 'prefix';
  readonly aliases = [] as string[];
  readonly usage = '[<prefix> [<required=true/false>]]';
  readonly description = 'Zmienia prefix';
  constructor(bot: Rolka) {
    this.bot = bot;
  }
  execute(message: Message, args: string[]) {
    if (args.length < 1) return message.channel.send(
      `Prefix: ${this.bot.prefix} (${this.bot.prefixRequired ? 'wymagany' : 'niewymagany'})`
    );
    if (!message.member.hasPermission('ADMINISTRATOR'))
      return message.channel.send('Tylko administrator może zmienić prefix');
    
    this.bot.prefix = args[0];

    if (args.length === 2) {
      if (args[1] === 'true') this.bot.prefixRequired = true;
      else if (args[1] === 'false') this.bot.prefixRequired = false;
      else return message.channel.send(`Nieprawidłowy argument ${args[1]}`);
    } 
    message.channel.send(
      `Zmieniono prefix na ${this.bot.prefix} ` +
      `(${this.bot.prefixRequired ? 'wymagany' : 'niewymagany'})`
    );
  }
}