import { Client, Message } from "discord.js";
import fs from "fs";
import { MESSAGE_PREFIX } from "./constants";

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

export const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
void client.login(config.token);

export function nthOccurrence(
  haystack: string,
  needle: string,
  index: number
): number {
  return haystack.split(needle, index).join(needle).length;
}

export function getRandomInt(min: any, max: any) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function extractMessageWithoutCommand(
  message: Message,
  prefix = MESSAGE_PREFIX
) {
  const args = message.content.slice(prefix.length).trim().split(" ");
  args.shift();
  const messageArguments = args.join(" ");
  return messageArguments;
}

export function extractCommand(message: Message, prefix = MESSAGE_PREFIX) {
  const args = message.content.slice(prefix.length).trim().split(" ");
  return args[0];
}
