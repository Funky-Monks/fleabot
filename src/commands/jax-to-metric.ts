import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
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
    const value = interaction.options.getNumber("value");
    const embed = new MessageEmbed().setColor("#c8ff00");
    if (value) {
      embed.addFields([
        {
          name: `Conversion result:`,
          value: `${value} jaxel equals ${value * 165} cm`,
        },
      ]);
    } else {
      embed.addFields([
        {
          name: `Failure: Invalid value given`,
          value: `Please use a valid number value`,
        },
      ]);
    }
    await interaction.reply({ embeds: [embed] });
  },
};
