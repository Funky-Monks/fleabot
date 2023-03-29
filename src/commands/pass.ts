import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "./command";
import { Colors, CommandInteraction } from "discord.js";

export const passCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("passdown")
    .setDescription("Pass down the stratocaster!"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      embeds: [{
        title: "Pass the Stratocaster down",
        color: Colors.Blurple,
        image: {
          url: "https://raw.githubusercontent.com/og-brandon/fleabot/master/images/pass.gif"
        }
      }]
    });
  }
};
