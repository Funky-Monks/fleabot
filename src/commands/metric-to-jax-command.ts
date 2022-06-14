import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
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
    const meter = interaction.options.getNumber("meter");
    const centimeter = interaction.options.getNumber("centimeter");
    const embed = new MessageEmbed().setColor("#c8ff00");
    if (meter || centimeter) {
      const sanitizedMeter = meter || 0;
      const sanitizedCentimeter = centimeter || 0;
      const completeCentimeter = sanitizedMeter * 100 + sanitizedCentimeter;
      const jaxel = completeCentimeter / 165;

      const formatted = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 2,
      }).format(jaxel);

      embed.addFields([
        {
          name: `Conversion result:`,
          value: `${completeCentimeter} cm equals ${formatted} jaxel`,
        },
      ]);
    } else {
      embed.addFields([
        {
          name: `Failure: Invalid values given`,
          value: `Please use a valid number values for centimeter and meter`,
        },
      ]);
    }
    await interaction.reply({ embeds: [embed] });
  },
};
