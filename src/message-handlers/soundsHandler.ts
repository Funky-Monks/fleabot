import { MessageHandler } from "./messageHandler";
import { Message } from "discord.js";
import { extractMessageWithoutCommand } from "../utils";

type Mapping = MappingEntry[];
type MappingEntry = {
  keys: string[];
  url: string;
};

const mapping: Mapping = [
  {
    keys: ["smells", "smell", "thesmells"],
    url: "https://s3.eu-central-1.amazonaws.com/bots.funkymonks.xyz/the_SMELLS.mp3",
  },
  {
    keys: ["cum", "cumslow", "cumslownow", "come", "comeslow", "comeslownow"],
    url: "https://s3.eu-central-1.amazonaws.com/bots.funkymonks.xyz/cum_slow_now.mp3",
  },
  {
    keys: ["makeyoucum", "makeyoucome"],
    url: "https://s3.eu-central-1.amazonaws.com/bots.funkymonks.xyz/frusciante_fanfare.mp3",
  },
];

export class SoundsHandler extends MessageHandler {
  triggerMessageSubstrings(): string[] {
    return ["sound"];
  }

  async handle(message: Message): Promise<void> {
    const messageArguments = extractMessageWithoutCommand(message);
    const entry = mapping.find((entry) =>
      entry.keys.includes(messageArguments.toLowerCase())
    );
    if (!entry) {
      message.channel.send("File not known");
    } else {
      message.channel.send({ files: [{
        attachment: entry.url
      }] });
    }
  }
}
