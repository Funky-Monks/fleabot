import { SlashCommandBuilder } from "@discordjs/builders";
import { Colors, CommandInteraction } from "discord.js";
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
    const value = interaction.options.data.find(option => option.name === "value")?.value;

    const centimeter = (value as number || 0) * 165;

    let inches = (centimeter * 0.393700787);
    let feet = Math.floor(inches / 12);
    inches %= 12;

    const formattedInches = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2
    }).format(inches);

    if (value) {
      await interaction.reply({
        embeds: [{
          color: Colors.Blue,
          description: `Conversion result: ${value} jaxel equals ${feet} ft ${formattedInches} in`
        }]
      });
    } else {
      await interaction.reply({
        embeds: [
          {
            color: Colors.Red,
            description: `Failure: Invalid value given`
          }
        ]
      });
    }
  }
};
