import { ICommand } from '../Api';
import { Message, MessageEmbed } from 'discord.js';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as fs from 'fs';

const pj = require('../../package.json');

export default class HelpCommand implements ICommand {
  readonly name = 'help';
  readonly aliases = ['h'];
  readonly usage = '';
  readonly description = 'Pokaż dostępne komendy';
  execute(message: Message, args: string[]) {
    const config = YAML.load(path.resolve(__dirname, '../config.yml'));

    const commandFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith('.js'));
    const commandStrings = [] as string[];
    for (const file of commandFiles) {
      const command = require(__dirname + `/${file}`).default;
      const cmd = new command();
      commandStrings.push(`\`${cmd.name}\`|\`${cmd.aliases.join('\`|\`')}\` ${cmd.usage} - ${cmd.description}`);
    }

    const embed = new MessageEmbed()
      .setTitle(`RolkaBot v${pj.version}`)
      .setDescription(`Prefix: ${config.prefix} ${config.prefixRequired ? '' : '(niewymagany)'}`)
      .addFields(
        {
          name: 'Dostępne komendy:', 
          value: `\`komenda\`|\`alias\` \`<argument [opcjonalny argument]>\` - opis\n\n${commandStrings.join('\n')}`,
        }
      )

    message.channel.send(embed);
  }
}