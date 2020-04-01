import { Command } from '../Api';
import { Message, MessageEmbed } from 'discord.js';

export default class RolkienCommand implements Command {
  readonly name = 'rolkien';
  readonly aliases = [] as string[];
  readonly usage = '';
  readonly description = '( ͡° ͜ʖ ͡°)';
  execute(message: Message): Promise<Message> {
    const embed = new MessageEmbed()
      .setImage('https://i.imgur.com/xmLdvbh.png');
    return message.channel.send(embed);
  }
}