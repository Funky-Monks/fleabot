import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "./command";

export const customaryToJaxCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("customary-to-jax")
    .setDescription(
      "Convert customary units to jax units. You can enter both feet and inches at the same time"
    )
    .addNumberOption((option) =>
      option
        .setName("inches")
        .setDescription("The inch value to convert")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("feet")
        .setDescription("The feet value to convert")
        .setRequired(false)
    ) as SlashCommandBuilder,
  async execute(interaction: CommandInteraction) {
    const inches = interaction.options.getNumber("inches") || 0;
    const feet = interaction.options.getNumber("feet") || 0;

    const embed = new MessageEmbed().setColor("#c8ff00");

    const completeInches = feet * 12 + inches;
    const centimeter = 2.54 * completeInches;
    const jax = centimeter / 160;
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(jax);
    embed.addFields([
      {
        name: `Conversion result:`,
        value: `${feet} feet ${inches} in equals ${formatted} jax`,
      },
    ]);
    await interaction.reply({ embeds: [embed] });
  },
};
