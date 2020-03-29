import { Client, Message, Collection } from 'discord.js';

import ICommand from './commands/Command';
import RollCommand from './commands/RollCommand';

export default class Rolka {
  private client: Client;
  private token: string;
  private prefix: string;
  private prefixRequired: boolean;
  private commands: Collection<string, ICommand>;

  constructor(config: any) {
    this.token = config.token;
    this.prefix = config.prefix;
    this.prefixRequired = config.prefixRequired;
    this.client = new Client();
    this.commands = new Collection();
  }

  public start(): void {
    console.log('Starting bot...');

    // Load commands
    this.commands.set('roll', new RollCommand());
    this.commands.set('r', new RollCommand());

    this.client.on('ready', () => {
      console.log('Bot connected');
    });

    this.client.on('message', (message) => {
      // Don't respond to own messages
      if (message.author.id === this.client.user.id) return;

      // Check prefix
      if (this.prefixRequired && !message.content.startsWith(this.prefix)) return;

      let msg = message.content;
      // Remove prefix
      if (msg.startsWith(this.prefix)) msg = msg.slice(this.prefix.length);

      const args = msg.split(/\s+/);
      const commandName = args.shift().toLowerCase();
      const command = this.commands.get(commandName);

      if (command) command.execute(message, args);
      else if (this.prefixRequired && message.content.startsWith(this.prefix)) {
        message.channel.send('Niewłaściwa komenda.');
      }
    });

    this.client.login(this.token);
  }
}