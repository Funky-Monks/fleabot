import {SlashCommandBuilder} from "@discordjs/builders";
import {Colors, CommandInteraction, Guild, GuildMemberRoleManager, Role} from "discord.js";
import {Command} from "./command";
import * as util from "util";
import {logger} from "../logger";
import axios from "axios";
import sharp, {Sharp} from "sharp";

export const selectRoleIconCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("select-role-icon")
        .setDescription("Upload a role icon")
        .addAttachmentOption((option) =>
            option
                .setName("role-icon")
                .setDescription("The role icon. Ideally a png of 128x128 px size, otherwise it will be scaled by the bot")
                .setRequired(true)
        ).addBooleanOption((option) =>
            option
                .setName("asterisk-mask")
                .setDescription("Apply an RHCP asterisk cutout mask")
                .setRequired(false)) as SlashCommandBuilder,
    async execute(interaction: CommandInteraction) {

        await interaction.reply({
            ephemeral: true,
            embeds: [
                {description: "Request received. Please wait."}
            ]
        });

        const guild = interaction.guild!!;
        const userId = interaction.user.id;
        const attachmentUrl = interaction.options.data.find(option => option.name === "role-icon")?.attachment?.url !!;
        const isMasked = interaction.options.data.find(option => option.name === "asterisk-mask")?.value as boolean | undefined || false;

        const userRoleName = "user_icon_role:" + userId;
        const targetPosition = await determineTargetPosition(guild);

        logger.info(`Requested icon url: ${attachmentUrl}. UserId: ${userId}. Target position: ${targetPosition}`);

        const resolvedUserIconRole = (await guild.roles.fetch())
            .filter((role) => role.name === userRoleName)
            .first();
        const buffer = await loadFile(attachmentUrl, isMasked);

        if (!resolvedUserIconRole) {
            await createIconRole(userRoleName, guild, buffer, targetPosition, interaction);
        } else {
            await updateIconRole(resolvedUserIconRole, buffer, interaction);
        }
    }
};


async function loadFile(attachmentUrl: string, isMasked: boolean) {
    logger.info("Loading attachment from url " + attachmentUrl)
    const axiosResponse = await axios
        .get(attachmentUrl, {
            responseType: "arraybuffer"
        });
    const data: ArrayBuffer = axiosResponse.data;
    logger.info("Length of response was " + data.byteLength)
    const sharpData: Sharp = sharp(data);
    let resized = sharpData.resize({height: 256, width: 256});
    let buf;
    if (isMasked) {
        buf = await sharp(__dirname + "/../asterisk-mask.png")
            .extractChannel("red")
            .toBuffer()
            .then(alpha => resized
                .joinChannel(alpha)
                .png()
                .toBuffer()
            )
    } else {
        buf = await resized.png().toBuffer()
    }
    logger.info("Resized image. New bytesize: " + buf.byteLength)
    return buf;
}

async function createIconRole(userRoleName: string,
                              guild: Guild,
                              buffer: Buffer,
                              position: number,
                              interaction: CommandInteraction<any>) {
    const userId = interaction.user.id;

    logger.info(`Role ${userRoleName} not found. Creating...`);
    try {
        const createdRole = await guild.roles.create({
            icon: buffer,
            name: userRoleName, position, reason: "Created by coffeebot"
        });
        logger.info(`Created role ${userRoleName} with icon`);
        await (interaction.member!!.roles as GuildMemberRoleManager).add(
            createdRole
        );
        logger.info(`Assigned role ${userRoleName} to user with id ${userId}`);
        await interaction.editReply({
            embeds: [
                {
                    description: `Created your icon role. Thank you!`
                }
            ]
        });
    } catch (e) {
        const message = `An error occurred while creating icon role: ${util.inspect(e)}`;
        logger.error(message);
        await interaction.editReply({
            embeds: [
                {
                    description: message, color: Colors.Red
                }
            ]
        });
    }
}

async function updateIconRole(userRole: Role, buffer: Buffer, interaction: CommandInteraction<any>) {
    try {

        await userRole.edit({
            icon: buffer
        });

        const msg = `Updated role ${userRole.name} with icon`;
        logger.info(msg);
        await interaction.editReply({
            embeds: [
                {
                    description: "Updated your role icon"
                }
            ]
        });
    } catch (e) {
        const msg = `Failed to edit role ${userRole.id} ${util.inspect(e)}`;
        logger.error(msg);
        await interaction.editReply({
            embeds: [
                {
                    description: msg, color: Colors.Red
                }
            ]
        });
    }
}

async function determineTargetPosition(guild: Guild) {
    const upmostColorRolePosition = Array.from((await guild.roles.fetch())
        .filter((role) => role.name.toLowerCase().includes("color:"))
        .values())
        .sort((a, b) => b.position - a.position)!!;
    return (upmostColorRolePosition[0]?.position || 0) + 1;
}