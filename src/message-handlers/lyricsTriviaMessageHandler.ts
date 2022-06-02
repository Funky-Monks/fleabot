import { MessageHandler } from "./messageHandler";
import { Message } from "discord.js";

export class LyricsTriviaMessageHandler extends MessageHandler {
  triggerMessageSubstrings(): string[] {
    return ["lt", "lyricstrivia"];
  }

  async handle(message: Message): Promise<void> {
    message.channel.send(
      "This command is now a slash command. Please use /lyricsgame"
    );
  }
}
