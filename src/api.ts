import { Message } from "discord.js";

export interface ICommand {
  name: string;
  aliases?: string[];
  description: string;
  execute(message: Message, args?: string[]): void;
};