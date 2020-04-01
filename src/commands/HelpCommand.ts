import { ICommand } from '../Api';
import { Message, MessageEmbed } from 'discord.js';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as fs from 'fs';
import config from '../config';

const pj = require('../../package.json');

export default class HelpCommand implements ICommand {
  readonly name = 'help';
  readonly aliases = ['h'];
  readonly usage = '';
  readonly description = 'Pokaż dostępne komendy';
  execute(message: Message, args: string[]) {
    const commandFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith('.js'));
    const commandStrings = [] as string[];
    for (const file of commandFiles) {
      const command = require(__dirname + `/${file}`).default;
      const cmd = new command();
      const commandString = buildCommandString(cmd.name, cmd.aliases, cmd.usage, cmd.description);
      commandStrings.push(commandString);
    }

    const embed = new MessageEmbed()
      .setTitle(`RolkaBot v${pj.version}`)
      .setDescription(`Prefix: ${config.PREFIX} ${config.PREFIX_REQUIRED ? '' : '(niewymagany)'}`)
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