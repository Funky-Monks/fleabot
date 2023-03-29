import { SlashCommandBuilder } from "@discordjs/builders";
import { Colors, CommandInteraction } from "discord.js";
import { Command } from "./command";

export const customaryToJaxCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("customary-to-jaxel")
    .setDescription(
      "Convert customary units to jaxel units. You can enter both feet and inches at the same time"
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
    const inches = interaction.options.data.find(option => option.name === "inches")?.value as number || 0;
    const feet = interaction.options.data.find(option => option.name === "feet")?.value as number|| 0;

    const completeInches = feet * 12 + inches;
    const centimeter = 2.54 * completeInches;
    const jaxel = centimeter / 165;
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2
    }).format(jaxel);
    await interaction.reply({
      embeds: [{
        color: Colors.Blue,
        description: `Conversion result: ${feet} feet ${inches} in equals ${formatted} jaxel`
      }]
    });
  }
};
