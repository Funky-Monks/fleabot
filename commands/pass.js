const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("passdown")
    .setDescription("Pass down the stratocaster!"),
  async execute(interaction) {
    const passEmbed = new MessageEmbed()
      .setTitle("Pass the Stratocaster down")
      .setColor("#ff0019")
      .setImage(
        "https://raw.githubusercontent.com/og-brandon/fleabot/master/images/pass.gif"
      );

    await interaction.reply({ embeds: [passEmbed] });
  },
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
