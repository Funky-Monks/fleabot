import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./command";

export const jaxToCustomaryCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("jaxel-to-customary")
    .setDescription("Convert jaxel units to customary units")
    .addNumberOption((option) =>
      option
        .setName("value")
        .setDescription("The value to convert")
        .setRequired(true)
    ) as SlashCommandBuilder,
  async execute(interaction: CommandInteraction) {
    const value = interaction.options.getNumber("value");
    const embed = new MessageEmbed().setColor("#c8ff00");

    const centimeter = (value || 0) * 165;

    let inches = (centimeter*0.393700787)
    let feet = Math.floor(inches / 12);
    inches %= 12;

    const formattedInches = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(inches);

    if (value) {
      embed.addFields([
        {
          name: `Conversion result:`,
          value: `${value} jaxel equals ${feet} ft ${formattedInches} in`,
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
