import { Message } from "discord.js";

export interface Config {
  TOKEN: string;
  PREFIX: string;
  PREFIX_REQUIRED: boolean;
}

export interface Command {
  name: string;
  aliases?: string[];
  usage: string;
  description: string;
  execute(message: Message, args?: string[]): Promise<Message>;
}