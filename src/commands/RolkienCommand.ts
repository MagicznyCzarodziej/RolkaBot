import { ICommand } from '../Api';
import { Message, MessageEmbed } from 'discord.js';

export default class RolkienCommand implements ICommand {
  readonly name = 'rolkien';
  readonly aliases = [] as string[];
  readonly usage = '';
  readonly description = '( ͡° ͜ʖ ͡°)';
  execute(message: Message, args: string[]) {
    const embed = new MessageEmbed()
      .setImage('https://i.imgur.com/xmLdvbh.png');
    message.channel.send(embed);
  }
}