import { SlashCommandBuilder } from "@discordjs/builders";
import { Colors, CommandInteraction } from "discord.js";
import { Command } from "./command";

export const metricToJaxCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("metric-to-jaxel")
    .setDescription(
      "Convert metric units to jaxel units. You can enter both centimeter and meter at the same time"
    )
    .addNumberOption((option) =>
      option
        .setName("centimeter")
        .setDescription("The centimeter value to convert")
        .setRequired(false)
    )
    .addNumberOption((option) =>
      option
        .setName("meter")
        .setDescription("The meter value to convert")
        .setRequired(false)
    ) as SlashCommandBuilder,
  async execute(interaction: CommandInteraction) {
    const meter = interaction.options.data.find(option => option.name === "meter")?.value;
    const centimeter = interaction.options.data.find(option => option.name === "centimeter")?.value;
    if (meter || centimeter) {
      const sanitizedMeter = meter || 0;
      const sanitizedCentimeter = centimeter || 0;
      const completeCentimeter = (sanitizedMeter as number) * 100 + (sanitizedCentimeter as number);
      const jaxel = completeCentimeter / 165;

      const formatted = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2
      }).format(jaxel);
      await interaction.reply({
        embeds: [{
          color: Colors.Blue,
          description: `Conversion result: ${completeCentimeter} cm equals ${formatted} jaxel`
        }]
      });
    } else {
      await interaction.reply({
        embeds: [{
          color: Colors.Blue,
          description: `Failure: Invalid values given`
        }]
      });
    }
  }
};
