import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  EmbedFieldData,
  MessageEmbed,
  User,
} from "discord.js";
import moment from "moment-timezone";
import { client } from "../utils";
import { logger } from "../logger";
import fs from "fs";
import { Command } from "./command";

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

const knownUsersToTimezones: Record<string, string[]> = config.tzUserRegistry;

export const timeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("membertime")
    .setDescription("Calculates the current time")
    .addNumberOption((option) =>
      option
        .setName("offset-hours")
        .setDescription(
          "The offset between now and the target time in hours. Defaults to 0"
        )
        .setMinValue(0)
        .setMaxValue(24)
        .setRequired(false)
    ) as SlashCommandBuilder,
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    if (interaction.guild?.id !== "483089063369375764") {
      await interaction.editReply("Not enabled");
      return;
    }
    const offset: number =
      interaction.options.getNumber("offset-hours", false) || 0;

    const fields: EmbedFieldData[] = [];
    for (let tz of Object.keys(knownUsersToTimezones)) {
      const userIds: string[] = knownUsersToTimezones[tz];
      const users = await Promise.all(
        userIds.map((userId) => client.users.fetch(userId))
      );
      const m = moment().utc().add(offset, "hours").tz(tz, false);
      fields.push({
        name: `🌐 ${m.format("HH:mm")} or 🍔 ${m.format("hh:mm A")}`,
        value: users.map((user) => user.toString()).join(" "),
      });
    }

    const passEmbed = new MessageEmbed()
      .setTitle(
        `⏰ Local times of members ${offset !== 0 ? `in ${offset} hours` : ""}`
      )
      .addFields(fields)
      .setColor("#ef9cdc")
      .setFooter({
        text: "Have a great day, Coffee Shop gang!",
        iconURL:
            "https://i.pinimg.com/originals/62/bd/2e/62bd2e623b0b6f08a672581b55c6c1a9.png",
      });
    await interaction.editReply({ embeds: [passEmbed] });
  },
};
