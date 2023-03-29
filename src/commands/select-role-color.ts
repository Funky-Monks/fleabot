import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Guild, GuildMemberRoleManager, MessageEmbed, Role } from "discord.js";
import { Command } from "./command";
import * as util from "util";
import { logger } from "../logger";

export const selectRoleColorCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("select-role-color")
    .setDescription("Select a role color using a hexcode")
    .addStringOption((option) =>
      option
        .setName("hexcode")
        .setDescription("The color hexcode")
        .setRequired(true)
    ) as SlashCommandBuilder,
  async execute(interaction: CommandInteraction) {

    await interaction.reply({
      embeds: [
        new MessageEmbed().setDescription("Request received. Please wait.")
      ]
    });
    const guild = interaction.guild!!;
    const userId = interaction.user.id;
    const hexcode = interaction.options.getString("hexcode")!!;
    const userRoleName = "user_color_role:" + userId;
    const color = parseInt(hexcode.replace(/^#/, ""), 16);
    const targetPosition = await determineTargetPosition(guild);

    logger.info(`Requested color: ${color}. UserId: ${userId}. Target position: ${targetPosition}`);

    const resolvedUserColorRole = (await guild.roles.fetch())
      .filter((role) => role.name === userRoleName)
      .first();

    if (!resolvedUserColorRole) {
      await createColorRole(userRoleName, guild, color, targetPosition, interaction);
    } else {
      await updateColorRole(resolvedUserColorRole, color, interaction);
    }
  }
};


async function createColorRole(userRoleName: string,
                               guild: Guild,
                               color: number,
                               position: number,
                               interaction: CommandInteraction<any>) {
  const userId = interaction.user.id;
  const hexColorString = `#${color.toString(16)}`;
  logger.info(`Role ${userRoleName} not found. Creating...`);
  try {
    const createdRole = await guild.roles.create({
      name: userRoleName, color, position, reason: "Created by coffeebot"
    });
    logger.info(`Created role ${userRoleName} with color ${hexColorString}`);
    await (interaction.member!!.roles as GuildMemberRoleManager).add(
      createdRole
    );
    logger.info(`Assigned role ${userRoleName} to user with id ${userId}`);
    await interaction.editReply({
      embeds: [
        new MessageEmbed().setDescription(`Created your role with color ${hexColorString}. Thank you!`).setColor(color)
      ]
    });
  } catch (e) {
    const msg = `An error occurred while creating color role: ${util.inspect(e)}`;
    logger.error(msg);
    await interaction.editReply({
      embeds: [
        new MessageEmbed().setDescription(msg).setColor("RED")
      ]
    });
  }
}

async function updateColorRole(userRole: Role, color: number, interaction: CommandInteraction<any>) {
  try {
    await userRole.edit({
      color
    });
    const hexColorString = `#${color.toString(16)}`;
    const msg = `Updated role ${userRole.name} with color ${hexColorString}`;
    logger.info(msg);
    await interaction.editReply({
      embeds: [
        new MessageEmbed().setDescription(`Updated your color role with hex color ${hexColorString}`).setColor(color)
      ]
    });
  } catch (e) {
    const msg = `Failed to edit role ${userRole.id} ${util.inspect(e)}`;
    logger.error(msg);
    await interaction.editReply({
      embeds: [
        new MessageEmbed().setDescription(msg).setColor("RED")
      ]
    });
  }
}

async function determineTargetPosition(guild: Guild) {
  const upmostColorRolePosition = Array.from((await guild.roles.fetch())
    .filter((role) => role.name.toLowerCase().includes("color:"))
    .values())
    .sort((a, b) => b.position - a.position);
  return upmostColorRolePosition[0].position + 1;
}