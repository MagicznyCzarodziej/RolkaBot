import { ICommand } from '../Api';
import { Message, MessageEmbed, Collection } from 'discord.js';
import Rolka from '../Rolka';

const pj = require('../../package.json');

export default class HelpCommand implements ICommand {
  private bot: Rolka;
  readonly name = 'help';
  readonly aliases = ['h'];
  readonly usage = '';
  readonly description = 'Pokaż dostępne komendy';
  constructor(bot: Rolka) {
    this.bot = bot;
  }
  execute(message: Message, args: string[]) {
    // Create set to remove duplicates from aliases
    const commands = new Set(this.bot.commands.values());
    const commandStrings = generateCommandList(commands);

    const embed = new MessageEmbed()
      .setTitle(`RolkaBot v${pj.version}`)
      .setDescription(`Prefix: ${this.bot.prefix} ` +
        `${this.bot.prefixRequired ? '' : '(niewymagany)'}`)
      .addFields(
        {
          name: 'Dostępne komendy:', 
          value: `\`komenda\`|\`alias\` \`<argument [opcjonalny argument]>\` - opis` +
            `\n\n${commandStrings.join('\n')}`,
        }
      )

    message.channel.send(embed);
  }
}

function buildCommandString (
    name: string,
    aliases: string[],
    usage: string,
    description: string,
  ): string {
  const nameString = `\`${name}\``;
  const aliasesString = `|\`${aliases.join('\`|\`')}\` `;
  const commandElements = [nameString, usage, ' - ', description];
  if (aliases.length) commandElements.splice(1, 0, aliasesString);

  return commandElements.join('');
}

function generateCommandList(commands: Set<ICommand> | ICommand[]): string[] {
  const commandStrings = [] as string[];
  for (const command of commands) {
    const commandString = buildCommandString(
      command.name,
      command.aliases,
      command.usage,
      command.description,
    );
    commandStrings.push(commandString);
  }
  return commandStrings;
}