import { ICommand } from '../Api';
import { Message, MessageEmbed } from 'discord.js';
import * as path from 'path';
import * as YAML from 'yamljs';

const pj = require('../../package.json');

export default class HelpCommand implements ICommand {
  readonly name = 'help';
  readonly aliases = ['h'];
  readonly description = 'Pokaż dostępne komendy';
  execute(message: Message, args: string[]) {
    const config = YAML.load(path.resolve(__dirname, '../config.yml'))

    const embed = new MessageEmbed()
      .setTitle(`RolkaBot v${pj.version}`)
      .setDescription(`Prefix: ${config.prefix} ${config.prefixRequired ? '' : '(niewymagany)'}`)
      .addFields(
        {
          name: 'Dostępne komendy:', 
          value: 
            '`help` `h` - wyświetla tę wiadomość\n' +
            '`roll` `r` - rzuć kośćmi | np. `roll 2d6`, `roll 3k20 2k4`)\n' +
            '`tales` `t` `tftl` - rzuć kośćmi d6 | np. `tales 4`, `tales 2 6`)',
        }
      )

    message.channel.send(embed);
  }
}