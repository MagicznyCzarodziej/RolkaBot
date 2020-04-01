import { Command } from '../Api';
import { Message, MessageEmbed } from 'discord.js';
import Rolka from '../Rolka';

import * as pj from '../../package.json';

export default class HelpCommand implements Command {
  private bot: Rolka;
  readonly name = 'help';
  readonly aliases = ['h'];
  readonly usage = '';
  readonly description = 'Pokaż dostępne komendy';
  constructor(bot: Rolka) {
    this.bot = bot;
  }
  execute(message: Message): Promise<Message> {
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

    return message.channel.send(embed);
  }
}

function buildCommandString (
    name: string,
    aliases: string[],
    usage: string,
    description: string,
  ): string {
  const nameString = `\`${name}\``;
  const aliasesString = `|\`${aliases.join('`|`')}\` `;
  const commandElements = [nameString, usage, ' - ', description];
  if (aliases.length) commandElements.splice(1, 0, aliasesString);

  return commandElements.join('');
}

function generateCommandList(commands: Set<Command> | Command[]): string[] {
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