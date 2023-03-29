import { SlashCommandBuilder } from "@discordjs/builders";
import { Colors, CommandInteraction } from "discord.js";
import { Command } from "./command";

export const jaxToMetricCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("jaxel-to-metric")
    .setDescription("Convert jaxel units to metric units")
    .addNumberOption((option) =>
      option
        .setName("value")
        .setDescription("The value to convert")
        .setRequired(true)
    ) as SlashCommandBuilder,
  async execute(interaction: CommandInteraction) {
    const value = interaction.options.data.find(option => option.name === "value")?.value;
    if (value) {
      await interaction.reply({
        embeds: [{
          color: Colors.Blue,
          description: `Conversion result: ${value} jaxel equals ${value as number * 165} cm`
        }]
      });
    } else {
      await interaction.reply({
        embeds: [{
          color: Colors.Red,
          description: `Failure: Invalid value given`
        }]
      });
    }
  }
};
