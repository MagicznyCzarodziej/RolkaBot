import { Message } from "discord.js";

export interface ICommand {
  name: string;
  aliases?: string[];
  usage: string;
  description: string;
  execute(message: Message, args?: string[]): void;
};