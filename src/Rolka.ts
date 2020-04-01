import * as fs from 'fs';
import { Client, Collection } from 'discord.js';
import { Command, Config } from './api';

export default class Rolka {
  private client: Client;
  private token: string;
  private _prefix: string;
  private _prefixRequired: boolean;
  private _commands: Collection<string, Command>;

  constructor(config: Config) {
    this.token = config.TOKEN;
    this._prefix = config.PREFIX;
    this._prefixRequired = config.PREFIX_REQUIRED;
    this.client = new Client();
    this._commands = new Collection();
  }

  get prefix(): string {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this._prefix = prefix;
    this.client.user.setActivity(`${this.prefix}help`, { type: 'LISTENING'});
  }

  get prefixRequired(): boolean {
    return this._prefixRequired;
  }

  set prefixRequired(required: boolean) {
    this._prefixRequired = required;
  }

  get commands(): Collection<string, Command> {
    return this._commands;
  }

  public async start(): Promise<void> {
    console.log('Starting bot...');

    // Load commands
    const commandFiles = fs.readdirSync(__dirname + '/commands')
      .filter((file) => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const command = require(__dirname + `/commands/${file}`).default;
      const commandInstance = new command(this);

      this.commands.set(commandInstance.name, commandInstance);
      for (const alias of commandInstance.aliases) {
        this.commands.set(alias, commandInstance);
      }
    }

    this.client.on('ready', () => {
      console.log('Bot connected');
      this.client.user.setActivity(`${this.prefix}help`, { type: 'LISTENING'});
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
      
      if (command) {
        try {
          command.execute(message, args);
        } catch(error) {
          message.channel.send('Wystąpił błąd podczas wykonywania komendy.');
          console.error(error);
        }
      } else if (this.prefixRequired && message.content.startsWith(this.prefix)) {
        message.channel.send('Niewłaściwa komenda.');
      }
    });

    try {
      await this.client.login(this.token);
    } catch (error) {
      console.error('ERROR: Invalid token');
    }
  }
}